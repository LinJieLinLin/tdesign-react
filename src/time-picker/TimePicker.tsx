import React, { useState, Ref } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeIcon } from 'tdesign-icons-react';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';

import SelectInput from '../select-input';
import TimeRangePicker from './TimeRangePicker';
import TimePickerPanel from './panel/TimePickerPanel';

import { DEFAULT_STEPS, DEFAULT_FORMAT, useTimePickerTextConfig } from './const';

import { StyledProps } from '../common';
import { TdTimePickerProps } from './type';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

export interface TimePickerProps extends TdTimePickerProps, StyledProps {}

const TimePicker = forwardRefWithStatics(
  (props: TimePickerProps, ref: Ref<HTMLDivElement>) => {
    const TEXT_CONFIG = useTimePickerTextConfig();

    const {
      allowInput,
      className,
      clearable,
      disabled,
      style,
      value = undefined,
      format = DEFAULT_FORMAT,
      hideDisabledTime = true,
      steps = DEFAULT_STEPS,
      placeholder = TEXT_CONFIG.placeholder,
      disableTime,
      onChange,
      onBlur = noop,
      onClose = noop,
      onFocus = noop,
      onOpen = noop,
    } = useDefaultValue(props);

    const [isPanelShowed, setPanelShow] = useState(false);

    const { classPrefix } = useConfig();
    const name = `${classPrefix}-time-picker`;
    const inputClasses = classNames(`${name}__group`, {
      [`${classPrefix}-is-focused`]: isPanelShowed,
      [`${classPrefix}-input--focused`]: isPanelShowed,
    });

    const handleShowPopup = (visible: boolean, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
      setPanelShow(visible);
      visible ? onOpen(context) : onClose(context); // trigger on-open and on-close
    };

    const handleClear = (context: { e: React.MouseEvent }) => {
      const { e } = context;
      e.stopPropagation();
      onChange(null);
    };

    const handleInputChange = (value: string) => {
      const isValidDate = validateInputValue(value, format);
      if (isValidDate) {
        onChange(formatInputValue(value, format));
      }
    };

    return (
      <div className={classNames(name, className)} ref={ref} style={style}>
        <SelectInput
          disabled={disabled}
          value={value ?? undefined}
          clearable={clearable}
          onClear={handleClear}
          placeholder={!value ? placeholder : undefined}
          className={inputClasses}
          allowInput={allowInput}
          suffixIcon={<TimeIcon />}
          popupVisible={isPanelShowed}
          onBlur={onBlur}
          onFocus={onFocus}
          onPopupVisibleChange={handleShowPopup}
          onInputChange={handleInputChange}
          panel={
            <TimePickerPanel
              steps={steps}
              format={format}
              disableTime={disableTime}
              hideDisabledTime={hideDisabledTime}
              isFooterDisplay={true}
              onChange={onChange}
              handleConfirmClick={(value) => {
                onChange(dayjs(value).format(format));
                setPanelShow(false);
              }}
              value={value}
            />
          }
        />
      </div>
    );
  },
  {
    displayName: 'TimePicker',
    TimeRangePicker,
  },
);

export default TimePicker;
