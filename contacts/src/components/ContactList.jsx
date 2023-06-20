import React from "react";
import PropTypes from "prop-types";
import { List } from "antd";

const ContactList = ({ contacts }) => {
  return (
    <List
      dataSource={contacts}
      renderItem={(contact) => (
        <List.Item key={`${contact.name}`}>
          <List.Item.Meta
            title={contact.name}
            description={<span><b>Phone: </b>{contact.phone}</span>}
          />
        </List.Item>
      )}
    />
  );
};

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ContactList;
