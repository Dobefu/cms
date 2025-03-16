import * as v from 'valibot'

function validateForm<
  TLoginSchema extends v.ObjectSchema<
    v.ObjectEntries,
    v.ErrorMessage<v.ObjectIssue> | undefined
  >,
  TFormState,
>(
  schema: TLoginSchema,
  prevState: TFormState,
  values: object,
): { isValid: boolean; newState: TFormState } {
  const { success, output, issues } = v.safeParse(schema, {
    ...prevState,
    ...values,
  })

  if (success) {
    return {
      isValid: success,
      newState: { ...prevState, ...output, errors: {} },
    }
  }

  const { nested: validationIssues } = v.flatten<TLoginSchema>(issues)

  return {
    isValid: false,
    newState: {
      ...prevState,
      ...(output as object),
      errors: validationIssues ?? {},
    },
  }
}

export { validateForm }
