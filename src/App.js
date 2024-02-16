import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import {Route, Switch} from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';

function App() {
  return (
    // The styles object here relates to the name we gave our import at the top and the .App 
    // relates to the .APP class we set in our css File. Now all the properties we created for 
    // the .App class name will be applied to this element
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        {/* The Switch holds all our Routes, and renders a given component when a Route path
        matches the current URL. The render prop on our Route component accepts a function
        that returns a component to be rendered when teh Route path is matched.  The path
        prop is the browser url the user will be at when they see teh component in our render prop.
        The exact prop tells the route to only render its component when teh url entered is exactly
        the same. */}
        <Switch>
          <Route exact path="/" render={() => <h1>Home page</h1>} />
          <Route exact path="/signin" render={() => <h1>Sign in</h1>} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route render={()=> <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;