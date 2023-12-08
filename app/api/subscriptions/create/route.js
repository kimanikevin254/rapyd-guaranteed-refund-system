import { makeRequest } from "@/utils/makeRequest";

export async function POST(req, res) {
   const { customer_id } = await req.json();

   try {
   	const body = {
       	customer: customer_id,
       	billing: "pay_automatically",
       	cancel_at_period_end: true,
       	days_until_due: 0,
       	simultaneous_invoice: true,
       	subscription_items: [
           	{
               	plan: "plan_80daa8aacd6e841f5c5cce4dff9966dd",
               	quantity: 1,
           	},
       	],
   	};
   	const result = await makeRequest(
       	"POST",
       	"/v1/payments/subscriptions",
       	body
   	);

   	return new Response(
       	JSON.stringify({
           	message: "Subscription created successfully",
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
           	error: "Unable to create subscription.",
       	}),
       	{
           	headers: { "Content-Type": "application/json" },
           	status: 400,
       	}
   	);
   }
}
