/***
 * @file:
 * @author: caojianping
 * @Date: 2023-03-30 15:07:25
 */

import {
  IValidationModel,
  IValidationOption,
  IValidationResult,
  IValidatorStrategy,
  ValidationMessageType,
  ValidationRuleType,
  ValidatorDataStoreType
} from './interfaces';
import { dateReplace, hasOwnProperty, isString } from './utils';

/**
 * 验证器策略配置
 */
let Strategy: IValidatorStrategy = {
  Rules: {
    /**
     * 必填规则
     * @param value
     * @param isRequired
     * @param msg
     */
    required: function (value: any, isRequired: boolean = false, msg: string = ''): any {
      if (isRequired) {
        if (isString(value)) {
          if (!value) {
            return msg || Strategy.Messages['required'];
          }
        } else {
          if (value === null || value === undefined) {
            return msg || Strategy.Messages['required'];
          }
        }
      }
    },
    /**
     * 最小值规则
     * @param value
     * @param num
     * @param msg
     */
    min: function (value: number, num: number, msg: string = ''): any {
      if (value < num) {
        return msg || Strategy.Messages['min'](num);
      }
    },
    /**
     * 最小值规则（排除num临界值）
     * @param value
     * @param num
     * @param msg
     */
    minExclude: function (value: number, num: number, msg: string = ''): any {
      if (value <= num) {
        return msg || Strategy.Messages['min'](num);
      }
    },
    /**
     * 最大值规则
     * @param value
     * @param num
     * @param msg
     */
    max: function (value: number, num: number, msg: string = ''): any {
      if (value > num) {
        return msg || Strategy.Messages['max'](num);
      }
    },
    /**
     * 最大值规则（排除num临界值）
     * @param value
     * @param num
     * @param msg
     */
    maxExclude: function (value: number, num: number, msg: string = ''): any {
      if (value >= num) {
        return msg || Strategy.Messages['max'](num);
      }
    },
    /**
     * 值范围规则
     * @param value
     * @param ranges
     * @param msg
     */
    range: function (value: number, ranges: Array<number>, msg: string = ''): any {
      let minNum, maxNum;
      if (ranges[0] > ranges[1]) {
        minNum = ranges[1];
        maxNum = ranges[0];
      } else {
        minNum = ranges[0];
        maxNum = ranges[1];
      }
      if (value < minNum && value > maxNum) {
        return msg || Strategy.Messages['range'](ranges);
      }
    },
    /**
     * 最小长度规则
     * @param value
     * @param length
     * @param msg
     */
    minLength: function (value: string, length: number, msg: string = ''): any {
      if (value.length < length) {
        return msg || Strategy.Messages['minLength'](length);
      }
    },
    /**
     * 最大长度规则
     * @param value
     * @param length
     * @param msg
     */
    maxLength: function (value: string, length: number, msg: string = ''): any {
      if (value.length > length) {
        return msg || Strategy.Messages['maxLength'](length);
      }
    },
    /**
     * 长度范围规则
     * @param value
     * @param ranges
     * @param msg
     */
    rangeLength: function (value: string, ranges: Array<number>, msg: string = ''): any {
      let minLength, maxLength;
      if (ranges[0] > ranges[1]) {
        minLength = ranges[1];
        maxLength = ranges[0];
      } else {
        minLength = ranges[0];
        maxLength = ranges[1];
      }

      let length = (value || '').length;
      if (length < minLength && length > maxLength) {
        return msg || Strategy.Messages['rangeLength'](ranges);
      }
    },
    /**
     * 最小日期规则
     * @param value
     * @param date
     * @param msg
     */
    minDate: function (value: string, date: string, msg: string = ''): any {
      value = dateReplace(value);
      date = dateReplace(date);
      if (new Date(value) < new Date(date)) {
        return msg || Strategy.Messages['minDate'](date);
      }
    },
    /**
     * 最大日期规则
     * @param value
     * @param date
     * @param msg
     */
    maxDate: function (value: string, date: string, msg: string = ''): any {
      value = dateReplace(value);
      date = dateReplace(date);
      if (new Date(value) > new Date(date)) {
        return msg || Strategy.Messages['maxDate'](date);
      }
    },
    /**
     * 选中规则
     * @param value
     * @param isChecked
     * @param msg
     */
    checked: function (value: boolean, isChecked: boolean = false, msg: string = ''): any {
      if (isChecked) {
        if (!value) {
          return msg || Strategy.Messages['checked'];
        }
      }
    },
    /**
     * 相等规则
     * @param value
     * @param relValue
     * @param msg
     */
    equal: function (value: string, relValue: string, msg: string = ''): any {
      if (value !== relValue) {
        return msg || Strategy.Messages['equal'];
      }
    },
    /**
     * 不相等规则
     * @param value
     * @param relValue
     * @param msg
     */
    unequal: function (value: string, relValue: string, msg: string = ''): any {
      if (value === relValue) {
        return msg || Strategy.Messages['unequal'];
      }
    },
    /**
     * 手机号码规则
     * @param value
     * @param isMobile
     * @param msg
     */
    mobile: function (value: string, isMobile: boolean = false, msg: string = ''): any {
      if (isMobile) {
        if (
          value &&
          // !/^(0|86|17951)?(1[2|3|4|5|7|8|9][0-9])[0-9]{8}$/.test(
          !/^(0|86|17951)?(1[0-9][0-9])[0-9]{8}$/.test(value)
        ) {
          return msg || Strategy.Messages['mobile'];
        }
      }
    },
    /**
     * 邮箱规则
     * @param value
     * @param isEmail
     * @param msg
     */
    email: function (value: string, isEmail: boolean = false, msg: string = ''): any {
      if (isEmail) {
        if (value && !/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/.test(value)) {
          return msg || Strategy.Messages['email'];
        }
      }
    },
    /**
     * 格式化规则
     * @param value
     * @param regex
     * @param msg
     */
    format: function (value: any, regex: any, msg: string = ''): any {
      if (value && !regex.test(value)) {
        return msg || Strategy.Messages['format'];
      }
    },
  } as ValidationRuleType,
  Messages: {
    required: '必填项',
    min: function (value: number) {
      return '请输入不小于' + value + '的数值';
    },
    minExclude: function (value: number) {
      return '请输入不小于等于' + value + '的数值';
    },
    max: function (value: number) {
      return '请输入不大于' + value + '的数值';
    },
    maxExclude: function (value: number) {
      return '请输入不大于等于' + value + '的数值';
    },
    range: function (ranges: Array<number>) {
      let minNum, maxNum;
      if (ranges[0] > ranges[1]) {
        minNum = ranges[1];
        maxNum = ranges[0];
      } else {
        minNum = ranges[0];
        maxNum = ranges[1];
      }
      return '请输入范围在' + minNum + '至' + maxNum + '之间的数值';
    },
    minLength: function (value: number) {
      return '最少可以输入' + value + '个字符';
    },
    maxLength: function (value: number) {
      return '最多可以输入' + value + '个字符';
    },
    rangeLength: function (ranges: Array<number>) {
      let minLength, maxLength;
      if (ranges[0] > ranges[1]) {
        minLength = ranges[1];
        maxLength = ranges[0];
      } else {
        minLength = ranges[0];
        maxLength = ranges[1];
      }
      return '请输入长度在' + minLength + '到' + maxLength + '之间的字符串';
    },
    minDate: function (value: string) {
      return '请输入不小于' + value + '的日期';
    },
    maxDate: function (value: string) {
      return '请输入不大于' + value + '的日期';
    },
    checked: '请先选中数据',
    equal: '两次密码输入不一致',
    unequal: '两次数据输入一致',
    mobile: '手机号码格式不正确',
    email: '邮箱地址格式不正确',
    format: '格式不正确',
  } as ValidationMessageType,
};

/**
 * 验证器类（策略模式实现）
 */
export default class Validator {
  /***
   * 存储数据
   */
  private dataStore: ValidatorDataStoreType = {};

  /**
   * 扩展规则
   * @param rules 规则集合
   * @param messages 消息集合
   * @returns 返回扩展结果
   */
  public static extendRule(rules: ValidationRuleType, messages: ValidationMessageType): boolean {
    for (const key in rules) {
      if (hasOwnProperty(rules, key)) {
        const value = rules[key];
        if (!hasOwnProperty(Strategy.Rules, key)) {
          Strategy.Rules[key] = value;
        }
      }
    }
    for (const key in messages) {
      if (hasOwnProperty(messages, key)) {
        const value = messages[key];
        if (!hasOwnProperty(Strategy.Messages, key)) {
          Strategy.Messages[key] = value;
        }
      }
    }
    return true;
  }

  /***
   * 添加验证规则
   * @param key 验证key
   * @param model 模型
   * @param rules 规则集合
   * @param messages 消息集合
   * @returns 返回添加结果
   */
  public addRule(
    key: string,
    model: IValidationModel,
    rules: ValidationRuleType,
    messages: ValidationMessageType = {}
  ): boolean {
    if (!hasOwnProperty(this.dataStore, key)) {
      this.dataStore[key] = {};
    }

    let name = model.name;
    this.dataStore[key][name] = [];

    let self = this,
      mvalue = model.value;
    for (let rule in rules) {
      (function (type, value, msg) {
        self.dataStore[key][name].push(function () {
          let Rules = Strategy.Rules;
          if (hasOwnProperty(Rules, type)) {
            return Rules[type].apply(null, [mvalue, value, msg]);
          }
        });
      })(rule, rules[rule], messages[rule]);
    }
    return true;
  }

  /**
   * 添加多条验证规则
   * @param key 验证key
   * @param options 选项集合
   * @returns 返回添加结果
   */
  public addRules(key: string, options: Array<IValidationOption>): boolean {
    if (!key) return false;

    let self = this;
    options.forEach((option: IValidationOption) => {
      let model = option.model,
        rules = option.rules,
        messages = option.messages;
      if (!key || !model || !rules) return true;

      if (!hasOwnProperty(self.dataStore, key)) {
        self.dataStore[key] = {};
      }

      let name = model.name;
      self.dataStore[key][name] = [];

      let mvalue = model.value;
      for (let rule in rules) {
        (function (type, value, msg) {
          self.dataStore[key][name].push(function () {
            let Rules = Strategy.Rules;
            if (hasOwnProperty(Rules, type)) {
              return Rules[type].apply(null, [mvalue, value, msg]);
            }
          });
        })(rule, rules[rule], messages[rule]);
      }
    });
    return true;
  }

  /**
   * 执行验证
   * @param key 验证key
   * @returns 返回验证结果
   */
  public execute(key: string): IValidationResult {
    let self = this,
      dataStore = self.dataStore,
      result = true,
      temp: any = {};
    for (let m in dataStore) {
      if (m !== key) continue;

      let value = dataStore[m] || {};
      for (let n in value) {
        let fns = value[n] || [];
        for (let i = 0, fn; (fn = fns[i++]); ) {
          let msg = fn();
          if (!msg) continue;

          result = false;
          temp[n] = msg;
          break;
        }
      }
    }
    return {
      status: result,
      data: temp,
    };
  }
}
