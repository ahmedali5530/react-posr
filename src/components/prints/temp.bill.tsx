import {Order} from "@/api/model/order.ts";
import {usePrint} from "./print.utility";
import {useEffect} from "react";

interface Props {
  order: Order
  onDone?: () => void
}

export const TempBill = ({
  order, onDone
}: Props) => {

  useEffect(() => {
    return () => onDone && onDone();
  }, []);

  const markup = (
    <>
      <div className="">
        <table>
          <tbody>
          <tr>
            <th>Order# {order.invoice_number}</th>
          </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  usePrint(markup);

  return null;
}
