const asyncHandler = (requestHandler)=>{
 (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler};



// const asyncHandler = ()=>{}
// high order function = >  function that accepet a function as perameter 
// const asyncHandler = (fn)=>{()=>{}}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };