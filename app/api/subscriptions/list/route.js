import { makeRequest } from "@/utils/makeRequest";

export async function POST(req, res) {
   const { customer_id } = await req.json();

   try {
   	const result = await makeRequest(
       	"GET",
       	`/v1/payments/subscriptions?customer=${customer_id}`
   	);

   	return new Response(
       	JSON.stringify({
           	subscriptions: result.body.data,
       	}),
       	{
           	headers: { "Content-Type": "application/json" },
           	status: 200,
       	}
   	);
   } catch (error) {
   	console.error("Error completing request", error);

   	return new Response(
       	JSON.stringify({
           	error: "Unable to fetch the subscriptions data.",
       	}),
       	{
           	headers: { "Content-Type": "application/json" },
           	status: 400,
       	}
   	);
   }
}
