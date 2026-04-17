import {Layout} from "@/screens/partials/layout.tsx";
import React, {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/common/input/button.tsx";
import {withCurrency} from "@/lib/utils.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {Closing as ClosingModel, Expense, PaymentSummary, TerminalCash} from "@/api/model/closing.ts";
import {PaymentType} from "@/api/model/payment_type.ts";
import useApi, {SettingsData} from "@/api/db/use.api.ts";
import {nanoid} from "nanoid";
import {toast} from "sonner";
import {Input} from "@/components/common/input/input.tsx";
import {Textarea} from "@/components/common/input/textarea.tsx";
import ScrollContainer from "react-indiana-drag-scroll";
import {nowSurrealDateTime, toLuxonDateTime} from "@/lib/datetime.ts";
import {DateTime as LuxonDateTime} from "luxon";
import {DateTime} from "surrealdb";

export const Closing = () => {
  const db = useDB();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get payment types
  const {data: paymentTypesData} = useApi<SettingsData<PaymentType>>(
    Tables.payment_types,
    [],
    ['priority asc'],
    0,
    99999
  );

  const paymentTypes = paymentTypesData?.data || [];

  // Form state
  const [previousDayBalance, setPreviousDayBalance] = useState<number>(0);
  const [pettyCash, setPettyCash] = useState<number>(0);
  const [terminalCash, setTerminalCash] = useState<TerminalCash[]>([
    {terminal_id: "terminal_1", terminal_name: "Terminal 1", cash_amount: 0},
    {terminal_id: "terminal_2", terminal_name: "Terminal 2", cash_amount: 0}
  ]);
  const [paymentSummaries, setPaymentSummaries] = useState<PaymentSummary[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notes, setNotes] = useState<string>("");

  const today = LuxonDateTime.now().toFormat(import.meta.env.VITE_DATE_FORMAT);

  // Fetch today's order payments
  const fetchTodaysPayments = async () => {
    try {

      const [result] = await db.query(`
          SELECT payments.*
          FROM order
          WHERE time::format(created_at, "${import.meta.env.VITE_DB_DATABASE_FORMAT}") = $today
            AND status = 'Paid'
              FETCH payments
              , payments.payment_type
      `, {today: toLuxonDateTime().toFormat(import.meta.env.VITE_DATE_FORMAT)});

      const orders = result;

      const paymentTotals = new Map<string, number>();

      // Aggregate payments by payment type
      orders.forEach((order: any) => {
        if (order.payments) {
          order.payments.forEach((payment: any) => {
            const paymentTypeId = payment.payment_type?.id.toString();
            if (paymentTypeId) {
              const current = paymentTotals.get(paymentTypeId) || 0;
              paymentTotals.set(paymentTypeId, current + payment.amount);
            }
          });
        }
      });

      return paymentTotals
    } catch (error) {
      console.error("Error fetching today's payments:", error);
      return new Map();
    }
  };

  // Initialize payment summaries when payment types are loaded
  useEffect(() => {
    if (paymentTypes.length > 0 && paymentSummaries.length === 0) {
      const initializePayments = async () => {
        const todaysPayments = await fetchTodaysPayments();

        setPaymentSummaries(
          paymentTypes.map(pt => ({
            payment_type: pt,
            amount: todaysPayments.get(pt.id.toString()) || 0
          }))
        );
      };

      initializePayments();
    }
  }, [paymentTypes, paymentSummaries.length]);

  // Calculations
  const totalCash = useMemo(() => {
    return terminalCash.reduce((sum, terminal) => sum + terminal.cash_amount, 0);
  }, [terminalCash]);

  const totalSystemCash = useMemo(() => {
    return paymentSummaries
      .filter(ps => ps.payment_type.type?.toLowerCase() === 'cash')
      .reduce((sum, ps) => sum + ps.amount, 0);
  }, [paymentSummaries]);

  const cashDifference = useMemo(() => {
    return totalCash - totalSystemCash;
  }, [totalCash, totalSystemCash]);

  const totalOtherPayments = useMemo(() => {
    return paymentSummaries
      .filter(ps => ps.payment_type.type?.toLowerCase() !== 'cash')
      .reduce((sum, ps) => sum + ps.amount, 0);
  }, [paymentSummaries]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const netAmount = useMemo(() => {
    return previousDayBalance + totalCash + pettyCash + totalOtherPayments - totalExpenses;
  }, [previousDayBalance, totalCash, pettyCash, totalOtherPayments, totalExpenses]);

  // Handlers
  const updateTerminalCash = (terminalId: string, amount: number) => {
    setTerminalCash(prev =>
      prev.map(terminal =>
        terminal.terminal_id === terminalId
          ? {...terminal, cash_amount: amount}
          : terminal
      )
    );
  };

  const updatePaymentSummary = (paymentTypeId: string, amount: number) => {
    setPaymentSummaries(prev =>
      prev.map(ps =>
        ps.payment_type.id === paymentTypeId
          ? {...ps, amount}
          : ps
      )
    );
  };

  const addTerminal = () => {
    setTerminalCash(prev => [
      ...prev,
      {
        terminal_id: nanoid(),
        terminal_name: `Terminal ${prev.length + 1}`,
        cash_amount: 0,
      }
    ])
  }

  const removeTerminal = (id: string) => {
    setTerminalCash(prev => prev.filter(terminal => terminal.terminal_id !== id));
  }

  const addExpense = () => {
    setExpenses(prev => [
      ...prev,
      {
        id: nanoid(),
        description: "",
        amount: 0,
        category: ""
      }
    ]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id
          ? {...expense, [field]: value}
          : expense
      )
    );
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getTodayClosing = async () => {
    const [result] = await db.query<ClosingModel[][]>(
      `
      SELECT *
      FROM ${Tables.closings}
      WHERE date_from = $start and date_to = $end and status = $status
      ORDER BY created_at DESC
      LIMIT 1
      `,
      {
        start: LuxonDateTime.now().startOf('day').toJSDate(),
        end: LuxonDateTime.now().endOf('day').toJSDate(),
        status: 'draft'
      }
    );

    return result?.[0];
  };

  const saveClosing = async (complete: boolean = false) => {
    setSaving(true);
    try {
      const existingClosing = await getTodayClosing();
      const closingData: Omit<ClosingModel, 'id' | 'status'> & {status: ClosingModel['status']} = {
        date_from: LuxonDateTime.now().startOf('day').toJSDate(),
        date_to: LuxonDateTime.now().endOf('day').toJSDate(),
        // previous_day_balance: previousDayBalance,
        cash_added: pettyCash,
        cash_withdrawn: 0, // TODO: map it later
        closing_balance: 0, // TODO: map it later
        denominations: {},
        terminal_cash: terminalCash,
        payments_data: paymentSummaries,
        expenses_data: expenses,
        // total_cash: totalCash,
        // total_other_payments: totalOtherPayments,
        expenses: totalExpenses,
        // net_amount: netAmount,
        notes: notes,
        created_at: nowSurrealDateTime(),
        status: complete ? 'completed' : 'draft'
      };

      if (existingClosing?.id) {
        await db.update(existingClosing.id, closingData);
      } else {
        await db.create(Tables.closings, closingData);
      }

      toast.success(complete ? "Closing completed successfully!" : "Closing saved as draft successfully!");

    } catch (error) {
      console.error("Error saving closing:", error);
      toast.error("Failed to save closing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout overflowHidden>
      <ScrollContainer className="overflow-y-auto h-[calc(100vh_-_30px)] select-none">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Daily Closing as of {today}</h1>

          {/* Previous Day Balance & Petty Cash */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Previous Day Balance</h2>
              <Input
                type="number"
                value={previousDayBalance}
                onChange={(e) => setPreviousDayBalance(Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
                enableKeyboard
                inputSize="lg"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Petty Cash</h2>
              <Input
                type="number"
                value={pettyCash}
                onChange={(e) => setPettyCash(Number(e.target.value))}
                placeholder="0.00"
                step="0.01"
                enableKeyboard
                inputSize="lg"
              />
            </div>
          </div>

          {/* Terminal Cash */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold mb-4">Terminal Cash</h2>
              <Button onClick={addTerminal} variant="primary" size="lg" type="button">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Add Terminal
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terminalCash.map((terminal) => (
                <div>
                  <label htmlFor="">{terminal.terminal_name}</label>
                  <div key={terminal.terminal_id} className="input-group">
                    <Input
                      type="number"
                      value={terminal.cash_amount}
                      onChange={(e) => updateTerminalCash(terminal.terminal_id, Number(e.target.value))}
                      placeholder={terminal.terminal_name}
                      enableKeyboard
                      inputSize="lg"
                    />
                    <Button
                      icon={faTrash}
                      size="lg"
                      iconButton
                      variant="danger"
                      onClick={() => removeTerminal(terminal.terminal_id)}
                    ></Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <span className="text-lg font-semibold">Total Cash: {withCurrency(totalCash)}</span>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Cash from payment summary</div>
              <div className="text-lg font-semibold">{withCurrency(totalSystemCash)}</div>
              <div
                className={`mt-2 text-lg font-semibold ${cashDifference === 0 ? 'text-gray-700' : cashDifference > 0 ? 'text-success-600' : 'text-danger-600'}`}
              >
                Difference: {withCurrency(cashDifference)}
              </div>
            </div>
          </div>

          {/* Payment Summaries */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Types Summary from system</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentSummaries.map((ps) => (
                <div key={ps.payment_type.id} className="border rounded-lg p-4">
                  <label className="block text-sm font-medium mb-2">{ps.payment_type.name}</label>
                  <Input
                    type="number"
                    value={ps.amount}
                    onChange={(e) => updatePaymentSummary(ps.payment_type.id, Number(e.target.value))}
                    placeholder={ps.payment_type.name}
                    inputSize="lg"
                    disabled
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <span className="text-lg font-semibold">Total Other Payments: {withCurrency(totalOtherPayments)}</span>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <Button onClick={addExpense} variant="primary" size="lg" type="button">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Add Expense
              </Button>
            </div>

            {expenses.map((expense) => (
              <div key={expense.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
                <Input
                  type="text"
                  value={expense.description}
                  onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                  placeholder="Description"
                  enableKeyboard
                  inputSize="lg"
                />
                <Input
                  type="text"
                  value={expense.category || ''}
                  onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                  placeholder="Category"
                  enableKeyboard
                  inputSize="lg"
                />
                <Input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                  placeholder="0.00"
                  step="0.01"
                  enableKeyboard
                  inputSize="lg"
                />
                <Button
                  onClick={() => removeExpense(expense.id)}
                  variant="danger"
                  size="lg"
                  type="button"
                >
                  <FontAwesomeIcon icon={faTrash}/>
                </Button>
              </div>
            ))}

            {expenses.length > 0 && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-semibold">Total Expenses: {withCurrency(totalExpenses)}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.currentTarget.value)}
              placeholder="Add any additional notes..."
              enableKeyboard
            />
          </div>

          {/* Summary */}
          <div className="bg-primary-100 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Previous Balance</div>
                <div className="text-xl font-semibold">{withCurrency(previousDayBalance)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Cash</div>
                <div className="text-xl font-semibold">{withCurrency(totalCash + pettyCash)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Other Payments</div>
                <div className="text-xl font-semibold">{withCurrency(totalOtherPayments)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Expenses</div>
                <div className="text-xl font-semibold text-red-600">-{withCurrency(totalExpenses)}</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="text-center">
                <div className="text-lg text-gray-600">Net Amount</div>
                <div className="text-3xl font-bold text-green-600">{withCurrency(netAmount)}</div>
              </div>
            </div>
          </div>

          {/* Save/Close Buttons */}
          <div className="text-center flex justify-center items-center gap-4">
            <Button
              onClick={() => saveClosing(false)}
              disabled={saving}
              variant="secondary"
              size="lg"
              type="button"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2"/>
              {saving ? 'Saving...' : 'Save Closing'}
            </Button>
            <Button
              onClick={() => saveClosing(true)}
              disabled={saving}
              variant="primary"
              size="lg"
              type="button"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2"/>
              {saving ? 'Saving...' : 'Close Closing'}
            </Button>
          </div>
        </div>
      </ScrollContainer>
    </Layout>
  );
};
