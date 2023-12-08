import { makeRequest } from "@/utils/makeRequest";

export async function POST(req, res) {
   const { subscription_id } = await req.json();

   // Retrieve the subscription from Rapyd
   try {
   	const result = await makeRequest(
       	"GET",
       	`/v1/payments/subscriptions/${subscription_id}`
   	);

   	// Retrieve the subscription creation date
   	const subscription_creation_date = result.body.data.created_at;

   	// Check if the customer is eligible for a refund
   	let epoch_seconds = Math.floor(new Date().getTime() / 1000);
   	let days_since_creation =
       	(epoch_seconds - subscription_creation_date) / (24 * 60 * 60);

   	// For users who are not eligible for a refund,
   	// the subscription will be canceled at the end of the billing cycle
   	if (days_since_creation > 7) {
       	try {
           	const result = await makeRequest(
               	"DELETE",
               	`/v1/payments/subscriptions/${subscription_id}`,
               	{
                   	cancel_at_period_end: true,
               	}
           	);

           	return new Response(
               	JSON.stringify({
                   	message: "Subscription canceled successfully",
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
                   	error: "Unable to cancel subscription",
               	}),
               	{
                   	headers: { "Content-Type": "application/json" },
                   	status: 400,
               	}
           	);
       	}
   	}

   	// For users who are eligible for a refund,
   	// the subscription will be canceled immediately
   	// and a refund will be issued.
   	else {
       	// Cancel subscription
       	try {
           	const result = await makeRequest(
               	"DELETE",
               	`/v1/payments/subscriptions/${subscription_id}`
           	);

           	// Retrieve the payment associated with the subscription
           	try {
               	const result = await makeRequest(
                   	"GET",
                   	`/v1/payments?subscription=${subscription_id}`
               	);

               	let subscription_payment_id = result.body.data[0].id;

               	// Create a refund
               	try {
                   	const body = {
                       	payment: subscription_payment_id,
                       	reason: "Subscription canceled within allowed timeframe.",
                   	};
                   	const result = await makeRequest(
                       	"POST",
                       	"/v1/refunds",
                       	body
                   	);

                   	return new Response(
                       	JSON.stringify({
                           	message:
                               	"Subscription canceled and refund issued successfully!",
                       	}),
                       	{
                           	headers: { "Content-Type": "application/json" },
                           	status: 200,
                       	}
                   	);
               	} catch (error) {
                   	console.error("Error completing request", error);
               	}
           	} catch (error) {
               	console.error("Error completing request", error);
           	}
       	} catch (error) {
           	console.error("Error completing request", error);
       	}
   	}
   } catch (error) {
   	console.error("Error completing request", error);

   	return new Response(
       	JSON.stringify({
           	error: "Unable to retrieve the subscription.",
       	}),
       	{
           	headers: { "Content-Type": "application/json" },
           	status: 400,
       	}
   	);
   }
}
