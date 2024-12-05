import React, { Component } from "react";
import "./HomePage.scss";
import axios from "axios";

const TdStyle = {
   ThStyle: `w-1/6 min-w-[160px] border-l border-transparent py-4 px-3 text-lg font-medium text-white lg:py-7 lg:px-4 `,
   TdStyle: `text-dark border-b border-l border-[#E8E8E8] bg-[#F3F6FF] dark:bg-dark-3 dark:border-dark dark:text-dark-7 py-5 px-2 text-center text-base font-medium`,
   TdStyle2: `text-dark border-b border-[#E8E8E8] bg-white dark:border-dark dark:bg-dark-2 dark:text-dark-7 py-5 px-2 text-center text-xs font-small h-[100px]`,
   TdButton: `inline-block px-2 py-2.5 border rounded-md border-primary text-primary hover:bg-slate-800 hover:text-white font-medium`,
}

interface Book{
   id: number;
   title: string;
   description: string;
   author: string;
}
interface HomePageProps {

}

interface HomePageState{
   id: number | null;
   title: string;
   description: string;
   author: string;
   books: Book[];
}

export default class HomePage extends Component<HomePageProps, HomePageState> {

   constructor(props: HomePageProps){
      super(props);
      this.state = {
         id: null,
         title: "",
         description: "",
         author: "",
         books: []
      };
   }

   componentDidMount() {
      this.getBooks();
   }

   getBooks = () => {
      axios.get("https://localhost:7181/api/BList") 
         .then(response => {
            this.setState({ books: response.data });
         })
         .catch(error => {
            console.error("There was an error fetching the books data!", error);
         });
   };

   deleteBook = (id: number) => {
      axios
         .delete(`https://localhost:7181/api/BList/${id}`) 
         .then(() => {
            // Filter out the deleted book from the state
            this.setState((prevState) => ({
               books: prevState.books.filter((book) => book.id !== id),
            }));
            alert("Book deleted successfully.");
         })
         .catch((error) => {
            console.error("There was an error deleting the book!", error);
            alert("Failed to delete the book.");
         });
   };

   handleUpdate = (book: Book) => {
      // Set the selected book's details in the input fields
      this.setState({
        id: book.id,
        title: book.title,
        description: book.description,
        author: book.author,
      });
    };

   updateBook = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
   
      const { id, title, description, author } = this.state;
   
      if (!id) {
         alert("Please enter a valid ID to update.");
         return;
      }
   
      const updatedBook = {id, title, description, author };
   
      axios
         .put(`https://localhost:7181/api/BList/${id}`, updatedBook) 
         .then(() => {
            alert("Book updated successfully.");
            this.getBooks(); // Refresh the books list
            this.setState({ id: null, title: "", description: "", author: "" }); 
         })
         .catch((error) => {
            console.error("There was an error updating the book!", error);
            alert("Failed to update the book.");
         });
   };
   

   // Handle form submission to add a new book
   handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const { title, description, author } = this.state;
      const newBook = { title, description, author };

      axios.post("https://localhost:7181/api/BList", newBook) 
         .then(response => {
            this.getBooks();  // Fetch updated list of books
            this.setState({ title: "", description: "", author: "" });  // Clear form inputs
         })
         .catch(error => {
            console.error("There was an error adding the book!", error);
         });
   };

   // Handle input changes
   handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      this.setState({ [name]: value } as unknown as Pick<HomePageState, keyof HomePageState>);
   };
   
   render() {
      return (
         <div className="min-h-screen bg-slate-600 lg:min-h-screen">
            <div className="MainContainer py-10">
               <span className="inline-flex mx-40 lg:flex lg:justify-center lg:mx-96 lg:h-10 md:flex md:place-content-center md:text-2xl text-xl items-center rounded-md bg-gray-50 px-40 py-1 lg:text-3xl font-medium text-slate-800 ring-1 ring-inset ring-gray-500/10">
                  LibSys
               </span>
               <div className="SubContainer ">
                  <section className='bg-transparent dark:bg-dark py-0 lg:py-[0px]'>
                     <div className='container'>
                        <div className='w-full'>
                           <div className='overflow-auto'>
                              <table className='w-full h-fit table-auto rounded-lg overflow-hidden'>
                                 <thead className='text-center bg-slate-800'>
                                    <tr>
                                       <th className={TdStyle.ThStyle}> Title </th>
                                       <th className="w-[300px] text-center bg-slate-800 py-4 px-3 font-medium text-white"> Description </th>
                                       <th className={TdStyle.ThStyle}> Author </th>
                                       <th className="bg-slate-800"></th>
                                    </tr>
                                 </thead>

                                 <tbody>
                                    {this.state.books.map((book, index) =>(
                                    <tr key={index}>
                                       <td className={TdStyle.TdStyle}>{book.title}</td>
                                       <td className={TdStyle.TdStyle2}>{book.description}</td>
                                       <td className={TdStyle.TdStyle}>{book.author}</td>
                                       <td className={TdStyle.TdStyle2}>
                                          <button className={TdStyle.TdButton} onClick={() => this.deleteBook(book.id)}>
                                             Delete
                                          </button>
                                       </td>
                                       {/* <td className={TdStyle.TdStyle2}>
                                          <a href='/#' className={TdStyle.TdButton}>
                                             Sign Up
                                          </a>
                                       </td> */}
                                    </tr>
                                    ))}
                                    
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </section>
                  {/* The TextFields */}
                  <div className="flex flex-col mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                           type="text"
                           name="title"
                           value={this.state.title}
                           placeholder="Enter Title"
                           onChange={this.handleChange}
                           className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600"
                        />
                        <input
                           type="text"
                           name="description"
                           value={this.state.description}
                           placeholder="Enter Description"
                           onChange={this.handleChange}
                           className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600"
                        />
                        <input
                           type="text"
                           name="author"
                           value={this.state.author}
                           placeholder="Enter Author"
                           onChange={this.handleChange}
                           className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600"
                        />
                        <input
                           type="number"
                           name="id"
                           value={this.state.id != null ? this.state.id: ""}
                           placeholder="Enter ID"
                           onChange={this.handleChange}
                           className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-600"
                        />
                     </div>
                     {/* Buttons */}
                     <div className="flex justify-center mt-4 space-x-4">
                        <button
                        onClick={this.handleSubmit}
                           className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                           Add
                        </button>
                        <button
                        onClick={this.updateBook}
                           className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                           Update
                        </button>
                        
                     </div>
                  </div>

               </div>
            </div>
         </div>
      )
   }
}