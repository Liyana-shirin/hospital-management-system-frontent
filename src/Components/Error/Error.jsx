// import React, { Component } from "react";
// import { Container, Alert, Button } from "react-bootstrap";

// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null, errorInfo: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught an error:", error, errorInfo);
//     this.setState({ error, errorInfo });
//   }

//   resetError = () => {
//     this.setState({ hasError: false, error: null, errorInfo: null });
//   };

//   render() {
//     if (this.state.hasError) {
//       return (
//         <Container className="my-5 text-center">
//           <Alert variant="danger">
//             <Alert.Heading>Something went wrong!</Alert.Heading>
//             <p>
//               An unexpected error occurred. Please try again or contact support if the issue persists.
//             </p>
//             {process.env.NODE_ENV === "development" && (
//               <details style={{ whiteSpace: "pre-wrap" }}>
//                 {this.state.error && this.state.error.toString()}
//                 <br />
//                 {this.state.errorInfo && this.state.errorInfo.componentStack}
//               </details>
//             )}
//             <Button variant="primary" onClick={this.resetError} className="mt-3">
//               Try Again
//             </Button>
//           </Alert>
//         </Container>
//       );
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;