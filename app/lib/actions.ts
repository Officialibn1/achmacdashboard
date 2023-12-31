"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const InvoiceScheme = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(["pending", "paid"]),
	date: z.string(),
});

const CreateInvoice = InvoiceScheme.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	});

	const amountInCent = amount * 100;

	const date = new Date().toISOString().split("T")[0];

	console.log(date);

	await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCent}, ${status}, ${date})
    `;

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");

	// Alternative way to extract the data
	// const rawFormData = Object.fromEntries(formData.entries());

	// console.log(rawFormData);
};

const UpdateInvoice = InvoiceScheme.omit({ date: true });

export const updateInvoice = async (id: string, formData: FormData) => {
	const { customerId, amount, status } = UpdateInvoice.parse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	});

	const amountInCent = amount * 100;

	await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCent}, status = ${status}
        WHERE id = ${id}
    `;

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
};
