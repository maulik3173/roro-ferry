import React,{useEffect} from 'react'

const Rootlayout = ({childern,className}) => {
    // automatically scroll to the top of the page when the component is rendered
    useEffect(() => {
        window.scrollTo(0, 0);
        });
        
  return (
    <div className={`w-full lg:px-24 md:px-16 sm:px-7 px-4 ${className}`}>
      {childern}
    </div>
  )
}

export default Rootlayout
