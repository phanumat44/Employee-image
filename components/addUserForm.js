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
    const [models, setModels] = useState();
    const [tempURL, setTempURL] = useState('https://cdn-icons-png.flaticon.com/512/3177/3177440.png');
    

    const queryClient = useQueryClient()
    const [formData, setFormData] = useReducer(formReducer, {})
    const addMutation = useMutation(addUser, {
        onSuccess : () => {
            queryClient.prefetchQuery('users', getUsers)
        }
    })

    function handleOnChange(changeEvent) {
        const reader = new FileReader();
    
        reader.onload = function(onLoadEvent) {
          setImageSrc(onLoadEvent.target.result);
          setUploadData(undefined);
        }
        reader.readAsDataURL(changeEvent.target.files[0]);

    }



    const handleSubmit = async (e) => {
        e.preventDefault();





        const form = e.currentTarget;
        const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    
        const formDatax = new FormData();
    
        for ( const file of fileInput.files ) {
          formDatax.append('file', file);
        }
    
        formDatax.append('upload_preset', 'my-uploads');
    
        const data = await fetch('https://api.cloudinary.com/v1_1/dvktk1a8x/image/upload', {
          method: 'POST',
          body: formDatax
        }).then(r => r.json());
   
 console.log(data.url)

        setImageSrc(data.url);
      //  setTempURL(data.url)
        setUploadData(data)
        
        
          let delayres = await delay(2000).then(e => {
            setTempURL(data.url)
            if(Object.keys(formData).length == 0) return console.log("Don't have Form Data");
            let { firstname, lastname, email, salary, date, status } = formData;
            const model = {
                name : `${firstname} ${lastname}`,
                avatar: `${data.url}`,
                email, salary, date, status : status ?? "Active"
            }
            setModels(model)
            addMutation.mutate(model)
          });
     

        
    }
    const delay = (delayInms) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
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
            <input onChange={handleOnChange} type="file" name="file" />
          </p>
           */}

          <label class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-full shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-gray-50" >
        <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span class="mt-2 text-base leading-normal">Select a file</span>
        <input type='file'  onChange={handleOnChange} class="hidden" name="file" />
    </label>

    



          <img src={imageSrc ? imageSrc : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"}
          className="max-w-64 max-h-64 w-64 rounded-full"
          />

          
          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {uploadData && (
            <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
          )}
            


        </form>
    )
}