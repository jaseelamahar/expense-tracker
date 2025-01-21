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
    useEffect(() => {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get('https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses.json');
          // Convert  object to an array of expenses
          const expensesArray = [];
          for (const key in response.data) {
            expensesArray.push({ id: key, ...response.data[key] });
          }
          setExpenses(expensesArray);
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      };
  
      fetchExpenses();
    }, []);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (
            !expensedata.amount ||
            !expensedata.description ||
            !expensedata.category
          ) {
            alert("Please fill in all fields!");
            return;
          }
          try {
            const response = await axios.post('https://expensetracker-bef3f-default-rtdb.firebaseio.com/expenses.json', expensedata);

            // Create a new expense object with the response id
            const newExpense = { id: response.data.name, ...expensedata };
      
            // Update the expenses state without fetching the updated list
            setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      
            // Clear form after successful submission
            setExpensedata({ amount: '', description: '', category: '' });
      
          } catch (error) {
            console.error('Error adding expense:', error);
          }
        };
  return (
    
    <div>
        <h1>Expense Tracker</h1>
      <form  onSubmit={handleSubmit}>
        <label htmlFor='amount' >Expense Amount:</label>
        <input type='number' name="amount" id='amount' value={expensedata.amount}onChange={inputChangeHandler} required />
        <label htmlFor='description'>Description:</label>
        <input type='text' id="description" name='description' value={expensedata.description} onChange={inputChangeHandler} required/>
        <label htmlFor='category' >Select category</label>
        <select id="category" name="category"  value={expensedata.category} onChange={inputChangeHandler} required>
        <option>Food </option>
        <option>Petrol</option>
        <option>Salary </option>
        <option>Rent </option>
        <option>Health </option>
        </select>
        <div><button>AddExpense</button></div>
      </form>

      <h2>Added Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              <strong>Amount:</strong> ${expense.amount} |{" "}
              <strong>Description:</strong> {expense.description} |{" "}
              <strong>Category:</strong> {expense.category}
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}

export default DailyExpense
