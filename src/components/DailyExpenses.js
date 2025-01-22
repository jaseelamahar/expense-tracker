import "./DailyExpenses.css"
import React, { useState,useEffect } from 'react';
import axios from 'axios';

const DailyExpense = () => {
    const[expenses,setExpenses]=useState([])
    const [expensedata,setExpensedata]=useState({
        amount:"",
        description:"",
        category:""
    })
    

    const inputChangeHandler=(e)=>{
        const { name, value } = e.target;
        setExpensedata((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
    const fetchUpdatedExpenses = async () => {
      try {
        const response = await axios.get(
          "https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses.json"
        );
        const expensesArray = [];
        for (const key in response.data) {
          expensesArray.push({ id: key, ...response.data[key] });
        }
        setExpenses(expensesArray);
      } catch (error) {
        console.error("Error fetching updated expenses:", error);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!expensedata.amount || !expensedata.description || !expensedata.category) {
        alert("Please fill in all fields!");
        return;
      }
      try {
        await axios.post(
          "https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses.json",
          expensedata
        );
        setExpensedata({ amount: "", description: "", category: "" });
        await fetchUpdatedExpenses();
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(
          `https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses/${id}.json`
        );
        await fetchUpdatedExpenses();
        console.log("deleted expense successfully")
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    };
  
    const handleEdit = async (id) => {
      const expenseToEdit = expenses.find((expense) => expense.id === id);
      if (expenseToEdit) {
        setExpensedata({
          amount: expenseToEdit.amount,
          description: expenseToEdit.description,
          category: expenseToEdit.category,
        });
        await handleDelete(id); // Remove the expense before editing it
        console.log("edited expense successfully")
      }
      
    };
  
    useEffect(() => {
      fetchUpdatedExpenses();
    }, []);
  
  return (
    
    <div className="expense-form">
        <h1>Expense Tracker</h1>
      <form  onSubmit={handleSubmit}>
        <div className="form-group">
        <label htmlFor='amount' className="form-label" >Expense Amount:</label>
        <input type='number' name="amount" id='amount' value={expensedata.amount}onChange={inputChangeHandler} required />
        <label htmlFor='description' className="form-label">Description:</label>
        <input type='text' id="description" name='description' value={expensedata.description} onChange={inputChangeHandler} required/>
        <label htmlFor='category'  className="form-label">Select category</label>
        <select id="category" name="category"  value={expensedata.category} onChange={inputChangeHandler} required>
        <option>Choose</option>
        <option>Food </option>
        <option>Petrol</option>
        <option>Salary </option>
        <option>Rent </option>
        <option>Health </option>
        </select>
        </div>
        <div><button>AddExpense</button></div>
      </form>

      <h2>Added Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense, index) => (
            <li key={index} className="expense-item">
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
  )
}

export default DailyExpense
