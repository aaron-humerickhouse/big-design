import React from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Form,
  H1,
  Input,
  Panel,
  Select
} from '@bigcommerce/big-design';
import { Product } from './data';
import * as Yup from 'yup';

const initialValues: Product = {
  name: '',
  stock: 0,
  category: 'Food'
};

interface Props {
  onNewProduct(product: Product): void;
}

export const ProductForm: React.FC<Props> = ({ onNewProduct }) => {
  const onSubmit = (product: Product) => {
    onNewProduct(product);
    resetForm();
  };

  const {
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    touched,
    values
  } = useFormik<Product>({
    initialValues,
    onSubmit,
    validationSchema: ProductSchema
  });

  return (
    <>
      <H1>Product Form</H1>
      <Panel>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group>
            <Input
              label="Name"
              description="Quis veniam ullamco duis ipsum consequat aliqua irure."
              name="name"
              onChange={handleChange}
              value={values.name}
              error={touched.name && errors.name}
              required
            />
          </Form.Group>
          <Form.Group>
            <Input
              label="Stock"
              description="Officia reprehenderit cillum Lorem eiusmod proident labore quis."
              name="stock"
              type="number"
              onChange={handleChange}
              value={values.stock}
              error={touched.stock && errors.stock}
              required
            />
          </Form.Group>

          <Form.Group>
            <Select
              label="Category"
              name="category"
              onItemChange={item => setFieldValue('category', item)}
              value={values.category}
              options={[
                { content: 'Food', value: 'Food' },
                { content: 'Drink', value: 'Drink' }
              ]}
              error={touched.category && errors.category}
              required
            />
          </Form.Group>

          <Box marginTop="xxLarge">
            <Button type="submit">Submit</Button>
          </Box>
        </Form>
      </Panel>
    </>
  );
};

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2)
    .max(50)
    .required(),
  stock: Yup.number()
    .required()
    .min(0)
    .max(100),
  category: Yup.string().required()
});
