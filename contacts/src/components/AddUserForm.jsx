import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Button } from "antd";

const AddUserForm = ({ contract, account }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await contract.methods.createContact(values.name, values.phone).send({ from: account });
      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please enter the phone number" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add User
        </Button>
      </Form.Item>
    </Form>
  );
};

AddUserForm.propTypes = {
  contract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

export default AddUserForm;
