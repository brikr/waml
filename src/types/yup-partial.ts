import {addMethod, object, AnySchema} from 'yup';
import {
  AnyObject,
  ObjectShape,
  OptionalObjectSchema,
  TypeOfShape,
} from 'yup/lib/object';
import {Maybe} from 'yup/lib/types';

addMethod(object, 'partial', function partial() {
  const newFields: Parameters<typeof object>[0] = {};
  for (const [key, value] of Object.entries<AnySchema>(this.fields)) {
    newFields[key] = value.optional();
  }
  return object(newFields);
});

export function partial<T extends ObjectShape>(
  schema: OptionalObjectSchema<any, AnyObject, TypeOfShape<any>>
): OptionalObjectSchema<any, AnyObject, TypeOfShape<any>> {
  const newFields: Parameters<typeof object>[0] = {};
  for (const [key, value] of Object.entries<AnySchema>(schema.fields)) {
    newFields[key] = value.optional();
  }
  return object(newFields);
}
