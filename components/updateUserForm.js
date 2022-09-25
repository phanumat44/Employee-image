import { useReducer } from "react"
import { BiBrush } from 'react-icons/bi'
import Success from "./success"
import Bug from "./bug"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { getUser, getUsers, updateUser } from "../lib/helper"

export default function UpdateUserForm({ formId, formData, setFormData }){

    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();
    const [models, setModels] = useState();
    const [tempURL, setTempURL] = useState(avatar);
    const [Data, setData] = useState();

    const queryClient = useQueryClient()
   const {isLoading, isError, data, error} = useQuery(['users', formId], () => getUser(formId))
    const UpdateMutation = useMutation((newData) => updateUser(formId, newData), {
        onSuccess : async (data) => {
            // queryClient.setQueryData('users', (old) => [data])
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


   if(isLoading) return <div>Loading...!</div>
   if(isError) return <div>Error</div>

   const { name, avatar, salary, date, email, status } = data;
   const [firstname, lastname] = name ? name.split(' ') : formData


   const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }


    const handleSubmit = async (e) => {

  e.preventDefault();

  if(imageSrc){
        const form = e.currentTarget;
        const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    
        const formDatax = new FormData();
    
        for ( const file of fileInput.files ) {
          formDatax.append('file', file);
        }
    
        formDatax.append('upload_preset', 'my-uploads');
    
        Data = await fetch('https://api.cloudinary.com/v1_1/dvktk1a8x/image/upload', {
          method: 'POST',
          body: formDatax
        }).then(r => r.json());

        setTempURL(Data.url);
        console.log(Data.url)
        setImageSrc(Data.url);
        setTempURL(Data.url)
        setUploadData(Data)
        }
        


        let delayres = await delay(1000).then( async ()=> {
            
          
          
        let userName = `${formData.firstname ?? firstname} ${formData.lastname ?? lastname}`;
        let updated = Object.assign({}, Data, formData, { name: userName ,avatar:imageSrc?Data.url:avatar})
        await UpdateMutation.mutate(updated)})
       
    }





    return (
        <form className="grid lg:grid-cols-2 w-4/6 gap-4" onSubmit={handleSubmit}>
            <div className="input-type">
                <input type="text" onChange={setFormData} defaultValue={firstname} name="firstname" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="FirstName" />
            </div>
            <div className="input-type">
                <input type="text" onChange={setFormData} defaultValue={lastname} name="lastname" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="LastName" />
            </div>
            <div className="input-type">
                <input type="text" onChange={setFormData} defaultValue={email} name="email" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="Email" />
            </div>
            <div className="input-type">
                <input type="text" onChange={setFormData} defaultValue={salary} name="salary" className="border w-full px-5 py-3 focus:outline-none rounded-md" placeholder="Salary" />
            </div>
            <div className="input-type">
                <input type="date" onChange={setFormData} defaultValue={date} name="date" className="border px-5 py-3 focus:outline-none rounded-md" placeholder="Salary" />
            </div>


            <div className="flex gap-10 items-center">
                <div className="form-check">
                    <input type="radio" defaultChecked={status == "Active"} onChange={setFormData} value="Active" id="radioDefault1" name="status" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300  bg-white checked:bg-green-500 checked:border-green-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" />
                    <label htmlFor="radioDefault1" className="inline-block tet-gray-800">
                        Active
                    </label>
                </div>
                <div className="form-check">
                    <input type="radio"  defaultChecked={status !== "Active"}  onChange={setFormData} value="Inactive" id="radioDefault2" name="status" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300  bg-white checked:bg-green-500 checked:border-green-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" />
                    <label htmlFor="radioDefault2" className="inline-block tet-gray-800">
                        Inactive
                    </label>
                </div>
            </div>

            <button className="flex justify-center text-md w-2/6 bg-yellow-400 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500 max-h-50" >
             Update <span className="px-1"><BiBrush size={24}></BiBrush></span>
            </button>

  
            <p>
            <input onChange={handleOnChange} type="file" name="file" />
          </p>
          
          <img src={imageSrc ? imageSrc : avatar } className="max-w-64 max-h-64 w-64 " />
          
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