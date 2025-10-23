import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Tables } from "@/api/db/tables.ts";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { Discount, DiscountType } from "@/api/model/discount.ts";
import { withCurrency } from "@/lib/utils.ts";
import {Textarea} from "@/components/common/input/textarea.tsx";
import {Input} from "@/components/common/input/input.tsx";

interface Props {
  notes?: string
  setNotes: (notes?: string) => void
}

export const OrderPaymentNotes = ({
  notes, setNotes
}: Props) => {

  return (
    <div className="flex flex-col h-full">
      <h5 className="text-3xl">Any notes</h5>
      <p className="text-neutral-500">You can write Card numbers or discount</p>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        enableKeyboard
        rows={5}
      />
    </div>
  );
}
