import React from 'react'
import { Formik, Form, Field } from 'formik'
 
const MyForm = () => (
  <Formik
    initialValues={{ name: '', email: '' }}
    validate={values => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Required'
      }
      if (!values.email) {
        errors.email = 'Required'
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address'
      }
      return errors
    }}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        setSubmitting(false)
      }, 400)
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <Field type="text" name="name" />
        <Field type="email" name="email" />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </Form>
    )}
  </Formik>
)
 
export default MyForm