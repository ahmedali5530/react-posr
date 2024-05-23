import React from "react";
import Select, { GroupBase, Props } from "react-select";
import { Theme } from "react-select/dist/declarations/src/";
import Spinner from "@/assets/images/spinner.svg";

const primaryColor = "23 23 23";
const focusRingColor = "152 189 254";

export const themeConfig = (theme: Theme) => ({
  ...theme,
  borderRadius: 8,
  colors: {
    ...theme.colors,
    primary: `rgb(${primaryColor})`,
    primary25: `rgb(${primaryColor} / 25%)`,
    primary50: `rgb(${primaryColor} / 50%)`,
    primary75: `rgb(${primaryColor} / 75%)`,
  },
});

export const styleConfig = {
  control: (base: any, props: any) => {
    return {
      ...base,
      '--min-height': props.selectProps.size === 'lg' ? '48px' : '40px',
      minHeight: 'var(--min-height)',
      borderColor: `rgb(${primaryColor})`,
      borderWidth: 2,
      ":hover": {
        borderColor: `rgb(${primaryColor})`,
      },
      boxShadow: "none",
    }
  },
};

export const classNamePrefix = "rs-";

const LoadingIndicator = () => {
  return <img alt="loading..." src={Spinner} className="w-[18px] mr-2" />;
};

export function ReactSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select
      closeMenuOnSelect={!props.isMulti}
      {...props}
      theme={themeConfig}
      styles={styleConfig}
      classNamePrefix={classNamePrefix}
      components={{
        LoadingIndicator: LoadingIndicator,
      }}
    />
  );
}
