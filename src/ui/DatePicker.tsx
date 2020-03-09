import React from 'react';
import { parse, format } from 'date-fns';
import { DateUtils } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './DatePicker.css';

interface Props {
  value: string;
  onChange: (value: string) => any;
}

const FORMAT = 'yyyy-MM-dd';

export const DatePicker: React.FunctionComponent<Props> = ({
  value,
  onChange,
}) => {
  const onDayChange = (date: Date) => {
    if (DateUtils.isDate(date)) {
      onChange(`${format(date, FORMAT)}`);
    }
  };
  const today = new Date();

  return (
    <DayPickerInput
      value={value}
      format={FORMAT}
      parseDate={parseDate}
      formatDate={formatDate}
      placeholder={`${format(today, FORMAT)}`}
      dayPickerProps={{
        disabledDays: {
          after: today,
        },
      }}
      onDayChange={onDayChange}
    />
  );
};

const parseDate = (date: string, format: string) => {
  const parsed = parse(date, format, new Date());
  return DateUtils.isDate(parsed) ? parsed : undefined;
};

const formatDate = (date: Date, dateFormat: string) => {
  return format(date, dateFormat);
};
