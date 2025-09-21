import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import z from 'zod';
import { cn } from '~/lib/utils';
import { useSession } from '~/utils/auth';
import { Button } from './ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
	name: z.string(),
	address: z.string(),
	city: z.string(),
	region: z.string(),
	postalCode: z.string(),
	country: z.string(),
});
export function Profile({ className, ...props }: React.ComponentProps<'div'>) {
	const { data: session } = useSession();
	const [params] = useSearchParams();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: session?.user.name,
			address: session?.user.address || '',
			city: session?.user.city || '',
			region: session?.user.region || '',
			postalCode: session?.user.postalCode || '',
			country: session?.user.country || '',
		},
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
		} catch (e) {
			toast.error('An error occured during sign in.');
		}
	};
	return (
		<div
			className={cn(className)}
			{...props}>
			Profile
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-6'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel htmlFor='name'>Full Name</FormLabel>
								<FormControl>
									<Input
										// placeholder='example@domain.org'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='address'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel htmlFor='address'>address</FormLabel>
								<FormControl>
									<Input
										// placeholder='example@domain.org'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='city'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel htmlFor='city'>city</FormLabel>
								<FormControl>
									<Input
										// placeholder='example@domain.org'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='region'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel htmlFor='region'>region</FormLabel>
								<FormControl>
									<Input
										// placeholder='example@domain.org'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='postalCode'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel htmlFor='postalCode'>postalCode</FormLabel>
								<FormControl>
									<Input
										// placeholder='example@domain.org'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='country'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel htmlFor='country'>country</FormLabel>
								<FormControl>
									<Input
										// placeholder='example@domain.org'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type='submit'
						className='w-full'>
						Login
					</Button>
				</form>
			</Form>
		</div>
	);
}
