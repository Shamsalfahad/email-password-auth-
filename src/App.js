import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import './App.css';
import app from "./firebase.init";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useState } from "react";




const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const[error, setError]= useState('');
  const [name, setName]= useState('');
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');

  const handleNameBlur= event =>{
    setName(event.target.value);
  }

  const handleEmailChange= event =>{
    setEmail(event.target.value);
  }

  const handlePasswordChange= event =>{
    setPassword(event.target.value);
  }
  const handelRegisteredChange = event =>{
    setRegistered (event.target.checked)
  }

  const handleFromSubmit= event =>{
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      
      event.stopPropagation();
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)){
     setError('Password Should Contain at least one special character')
     return;
   }
    setValidated(true);
    setError('');

    if(registered){
      signInWithEmailAndPassword(auth, email , password)
      .then(result =>{
        const user = result.user;
        console.log(user);
      })
      .catch(error=>{
        console.error(error);
        setError(error.message);
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
    .then(result =>{
      const user = result.user;
      console.log(user);
      setEmail('');
      setPassword('')
      verifyEmail();
      setUserName();
    })
    .catch(error =>{
      console.error(error);
      setError(error.message);
    })

    }

    
    event.preventDefault();
  }
  const handlePasswordReset = () =>{
    sendPasswordResetEmail(auth,email)
    .then(()=>{
      console.log('Email Sent')
    })
  }
  const setUserName= () =>{
    updateProfile(auth.currentUser,{
      displayName:name
    })
    .then(()=>{
      console.log('updating name');
    })
    .catch(error =>{
      setError(error.message);
    })
  }
  
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(() =>{
      console.log('Email Verification Sent');
    })
  }

  return (
    <div>
      {/* <form onSubmit={handleFromSubmit}>
        <input onBlur={handleEmailChange} type="email" name="" id="" />
        <br />
        <input onBlur={handlePasswordChange} type="password" name="" id="" />
        <br />
        <input type="submit" value="Login" />
      </form> */}
     <div className="registration w-50 mx-auto mt-2">
       <h2 className="text-primary">Please {registered ? 'login': 'Register'}!!</h2>
     <Form  noValidate validated={validated} onSubmit={handleFromSubmit}>
{  !registered  &&  <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Your Name</Form.Label>
      <Form.Control onBlur={handleNameBlur} type="text" placeholder="Your Name " required />
     
      <Form.Control.Feedback type="invalid">
        Please provide your name.
      </Form.Control.Feedback>
      </Form.Group> }
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control onBlur={handleEmailChange} type="email" placeholder="Enter email " required />
    <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text>
    <Form.Control.Feedback type="invalid">
            Please provide a valid Email.
          </Form.Control.Feedback>
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control onBlur={handlePasswordChange} type="password" placeholder="Password"  required/>
    <Form.Control.Feedback type="invalid">
            Please provide a valid Password.
          </Form.Control.Feedback>
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check onChange={handelRegisteredChange} type="checkbox" label="Already Registered?" />
  </Form.Group>
  {/* <p className="text-success">{'Success'}</p> */}
  <p className="text-danger">{error}</p>
  <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
  <br />
  <Button variant="primary" type="submit">
    {registered ? "Login":"Registered"}
  </Button>
</Form>
     </div>
    </div>
  );
}

export default App;
