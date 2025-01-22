import "./DailyExpenses.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [expensedata, setExpensedata] = useState({
    amount: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          "https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses.json"
        );
        const fetchedExpenses = [];
        for (const key in response.data) {
          fetchedExpenses.push({
            id: key,
            ...response.data[key],
          });
        }
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);
  
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setExpensedata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newExpense = { ...expensedata };
    if (expensedata.id) {
      // Update existing expense
      try {
        await updateExpense(expensedata.id, newExpense);
        setExpenses((prev) =>
          prev.map((expense) => (expense.id === expensedata.id ? newExpense : expense))
        );
        setExpensedata({ amount: "", description: "", category: "", id: "" });
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    } else {
      // Add new expense
      try {
        const response = await fetch('https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
        });
        const data = await response.json();
        newExpense.id = data.name; // Firebase generates the ID
        setExpenses((prev) => [...prev, newExpense]);
        setExpensedata({ amount: "", description: "", category: "" });
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  };

  const handleEdit = (id) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    setExpensedata(expenseToEdit); // Pre-fill the form with the selected expense's data
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id)); // Remove the deleted item from state
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      const response = await fetch(`https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses/${id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      console.log("Expense updated:", data);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses/${id}.json`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log("Expense deleted:", data);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };


 
  return (
    <div className="expense-form">
      <h1>Expense Tracker</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount" className="form-label">Expense Amount:</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={expensedata.amount}
            onChange={inputChangeHandler}
            required
          />
          <label htmlFor="description" className="form-label">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={expensedata.description}
            onChange={inputChangeHandler}
            required
          />
          <label htmlFor="category" className="form-label">Select category</label>
          <select
            id="category"
            name="category"
            value={expensedata.category}
            onChange={inputChangeHandler}
            required
          >
            <option>Choose</option>
            <option>Food</option>
            <option>Petrol</option>
            <option>Salary</option>
            <option>Rent</option>
            <option>Health</option>
          </select>
        </div>
        <div>
          <button>{expensedata.id ? "Update Expense" : "Add Expense"}</button>
        </div>
      </form>

      <h2>Added Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id}  className="expense-item">
              <strong>Amount:</strong> ${expense.amount} |{" "}
              <strong>Description:</strong> {expense.description} |{" "}
              <strong>Category:</strong> {expense.category}
              <button onClick={() => handleEdit(expense.id)}>Edit</button>
              <button onClick={() => handleDelete(expense.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DailyExpense;
