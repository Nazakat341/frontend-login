import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    image: null, // Initialize with null
  });

  let [data, setData] = useState([]);

  const [editUserId, setEditUserId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/getUsers');
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error('Axios Error:', error);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file, // Update the image property
    });
  };

  const handleChange = (e) => {
    console.log('target',e.target)
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const formDataToSend = new FormData();
      // formDataToSend.append('fname', formData.fname);
      // formDataToSend.append('lname', formData.lname);
      // formDataToSend.append('email', formData.email);
      // formDataToSend.append('password', formData.password);
      // formDataToSend.append('image', formData.image); // Append the image

      if (editMode && editUserId) {
        // Update the user
        await axios.put(`http://localhost:4000/updateUser/${editUserId}`, formData);
        setEditMode(false);
        setEditUserId('');
      } else {
        // Create a new user
        console.log('formData',formData)
        await axios.post('http://localhost:4000/createUsers', formData);
      }

      // Fetch updated data from the backend after the form submission
      getData();

      // Clear the form fields
      setFormData({
        fname: '',
        lname: '',
        email: '',
        password: '',
        image: null, // Clear the image
      });

      console.log('User operation completed successfully');
    } catch (error) {
      console.error('Axios Error:', error);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
      }
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditMode(true);
    setEditUserId(user._id);
  };

  const handleDelete = async (userId) => {
    try {
      // Delete the user by ID
      await axios.delete(`http://localhost:4000/deleteUser/${userId}`);
      getData();
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Axios Error:', error);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
      }
    }
  };


  return (
    <div className="App">
      <h1>Welcome to React App</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fname">First Name:</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lname">Last Name:</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">{editMode ? 'Update' : 'Create'}</button>
      </form>

      <button onClick={getData}>Clickme</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>FName</th>
            <th>LName</th>
            <th>Email</th>
            <th>password</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.fname}</td>
              <td>{item.lname}</td>
              <td>{item.email}</td>
              <td>{item.password}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
              <td>
                {item.image && <img src={URL.createObjectURL(item.image)} alt="User" width="100" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;  
