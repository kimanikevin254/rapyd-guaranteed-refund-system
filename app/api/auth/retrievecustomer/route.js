import { makeRequest } from "@/utils/makeRequest";

export async function POST(req, res){
   const { customer_id } = await req.json()
  
   try {
       const result = await makeRequest('GET', `/v1/customers/${customer_id}`);
  
       const next_action = result.body.data.payment_methods.data[0].next_action

       return new Response(
           JSON.stringify({
               message: next_action,
           }),
           {
               headers: { "Content-Type": "application/json" },
               status: 200,
           }
       );
     } catch (error) {
       console.error("Error completing request", error);
       // Return an error
       return new Response(
           JSON.stringify({
               error: "Unable to retrieve the customer",
           }),
           {
               headers: { "Content-Type": "application/json" },
               status: 400,
           }
       );
     }
}
