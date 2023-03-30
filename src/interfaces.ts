/***
 * @file:
 * @author: caojianping
 * @Date: 2023-03-30 15:06:59
 */

/**
 * 验证器数据存储类型
 */
export type ValidatorDataStoreType = {
  [key: string]: { [field: string]: Array<Function> };
};

/**
 * 验证规则类型
 */
export type ValidationRuleType = { [ruleType: string]: any };

/**
 * 验证消息类型
 */
export type ValidationMessageType = { [msgType: string]: any };

/**
 * 验证器策略接口
 */
export interface IValidatorStrategy {
  // 规则
  Rules: ValidationRuleType;

  // 消息
  Messages: ValidationMessageType;
}

/**
 * 验证模型接口
 */
export interface IValidationModel {
  // 名称
  name: string;

  // 数据
  value: any;
}

/**
 * 验证选项接口
 */
export interface IValidationOption {
  // 模型
  model: IValidationModel;

  // 规则
  rules: ValidationRuleType;

  // 消息
  messages: ValidationMessageType;
}

/**
 * 验证结果接口
 */
export interface IValidationResult {
  // 状态
  status: boolean;

  // 数据
  data: any;
}
