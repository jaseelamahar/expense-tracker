import React, { useState } from 'react'

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

    const handleSubmit=(e)=>{
        e.preventDefault();
        if (
            !expensedata.amount ||
            !expensedata.description ||
            !expensedata.category
          ) {
            alert("Please fill in all fields!");
            return;
          }
          setExpenses((prevExpenses) => [...prevExpenses, expensedata]);
    setExpensedata({ amount: "", description: "", category: "" });
    }
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
