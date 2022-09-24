import { useReducer } from "react"
import { BiPlus } from 'react-icons/bi'
import Success from "./success"
import Bug from "./bug"
import { useQueryClient, useMutation } from "react-query"
import { addUser, getUsers } from "../lib/helper"
import { useState } from "react"

const formReducer = (state, event) => {
    return {
        ...state,
        [event.target.name]: event.target.value
    }
}

export default function AddUserForm(){

    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();


    const queryClient = useQueryClient()
    const [formData, setFormData] = useReducer(formReducer, {})
    const addMutation = useMutation(addUser, {
        onSuccess : () => {
            queryClient.prefetchQuery('users', getUsers)
        }
    })

    // function handleOnChange(changeEvent) {
    //     const reader = new FileReader();
    
    //     reader.onload = function(onLoadEvent) {
    //       setImageSrc(onLoadEvent.target.result);
    //       setUploadData(undefined);
    //     }
    //     reader.readAsDataURL(changeEvent.target.files[0]);
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();





        // const form = event.currentTarget;
        // const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    
        // const formData = new FormData();
    
        // for ( const file of fileInput.files ) {
        //   formData.append('file', file);
        // }
    
        // formData.append('upload_preset', 'my-uploads');
    
        // const data = await fetch('https://api.cloudinary.com/v1_1/dpvocrenk/image/upload', {
        //   method: 'POST',
        //   body: formData
        // }).then(r => r.json());
    
        // setImageSrc(data.secure_url);
        // console.log(data.secure_url)
        // setUploadData(data)
        
        if(Object.keys(formData).length == 0) return console.log("Don't have Form Data");
        let { firstname, lastname, email, salary, date, status } = formData;

        const model = {
            name : `${firstname} ${lastname}`,
            avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 10)}.jpg`,
            email, salary, date, status : status ?? "Active"
        }

        addMutation.mutate(model)
    }

    if(addMutation.isLoading) return <div>Loading!</div>
    if(addMutation.isError) return <Bug message={addMutation.error.message}></Bug>
    if(addMutation.isSuccess) return <Success message={"Added Successfully"}></Success>

    return (
        <form className="grid lg:grid-cols-2 w-4/6 gap-4"
          onSubmit={handleSubmit} 
        //  onChange={handleOnChange}
          method="post" >

            <div className="input-type">
                <input type="text" onChange={setFormData} name="firstname" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="FirstName" />
            </div>
            <div className="input-type">
                <input type="text" onChange={setFormData} name="lastname" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="LastName" />
            </div>
            <div className="input-type">
                <input type="text" onChange={setFormData} name="email" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="Email" />
            </div>
            <div className="input-type">
                <input type="text" onChange={setFormData} name="salary" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="Salary" />
            </div>
            <div className="input-type">
                <input type="date" onChange={setFormData} name="date" className="border px-5 py-3 focus:outline-none rounded-md" placeholder="Salary" />
            </div>


            <div className="flex gap-10 items-center">
                <div className="form-check">
                    <input type="radio" onChange={setFormData} value="Active" id="radioDefault1" name="status" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300  bg-white checked:bg-green-500 checked:border-green-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" />
                    <label htmlFor="radioDefault1" className="inline-block tet-gray-800">
                        Active
                    </label>
                </div>
                <div className="form-check">
                    <input type="radio" onChange={setFormData} value="Inactive" id="radioDefault2" name="status" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300  bg-white checked:bg-green-500 checked:border-green-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" />
                    <label htmlFor="radioDefault2" className="inline-block tet-gray-800">
                        Inactive
                    </label>
                </div>
            </div>

            <button type="submit" className="flex justify-center text-md w-2/6 bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500">
             Add <span className="px-1"><BiPlus size={24}></BiPlus></span>
            </button>
           
            {/* <p>
            <input type="file" name="file" />
          </p>
          
          <img src={imageSrc} />
          
          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {uploadData && (
            <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
          )} */}
            


        </form>
    )
}