import React , {memo} from "react"
function InputBox({label, placeholder,htmlFor,onChange}) {
  return <div className="flex flex-col">
    <label htmlFor={htmlFor} className="text-sm font-medium text-left py-2 ">
      {label}
    </label>
    <input onChange={onChange} id={htmlFor}  name={htmlFor}  placeholder={placeholder} className="w-full px-2 py-2 border rounded border-slate-200" />
  </div>
}

export default memo(InputBox)