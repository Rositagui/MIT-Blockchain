import React, { useEffect, useState } from "react";
import web3 from "./web3/web3";
import contract from "./web3/contract";
import { Typography } from "antd";
import ContactList from "./components/ContactList";
import AddUserForm from "./components/AddUserForm";

const { Title } = Typography;

function App() {
  const [account, setAccount] = useState();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const counter = await contract.methods.count().call();

        const fetchedContacts = [];

        for (let i = 1; i <= counter; i++) {
          const contact = await contract.methods.contacts(i).call();
          fetchedContacts.push(contact);
        }

        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <Title level={4}>Your account is: {account}</Title>
      <Title level={2}>Contacts</Title>
      <ContactList contacts={contacts} />
      {account && (
        <>
          <Title level={2}>Add User</Title>
          <AddUserForm contract={contract} account={account} />
        </>
      )}
    </div>
  );
}

export default App;
