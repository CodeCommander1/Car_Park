import React from 'react';
const Hello=()=>{
    function Handler(fordata){
        fordata.preventDefault();
        // console.log("Form Submitted");
        // const ref=fordata.target;
        // const formdata=new Formdata{ref};
        // const name=formdata.get{'name'};console.log{name};
        // const mail=formdata.get{'mail'};console.log{mail};
        // const pass=formdata.get{'pass'};console.log{pass};
        
    }
    return(
        <form onSubmit={Handler}>
            <h1>Hello Form</h1>
            <label htmlFor="name">Name:</label>
            <label>
                <input type="text" name='name' id='name'/>
            </label>
            <br />
            <label htmlFor="mail">Email:</label>
            <input type="email" name="mail" id="mail" />
            <br />
            <label htmlFor="password">Password</label>
            <input type="text" name='password' id='password' />
            <br />
            <input type="submit" value="Submit" />

            <label><input type="radio" name='degree' value='BCA' /> BCA</label>
            <label><input type="radio" name='degree' value='BBA' /> BBA</label>
            <label><input type="radio" name='degree' value='BTech' /> BTech</label>

        </form>
    )
}
export default Hello;
