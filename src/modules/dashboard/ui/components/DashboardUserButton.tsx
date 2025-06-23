import { authClient } from '@/lib/auth-client'
import React from 'react'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerDescription, 
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import GeneratedAvatar from '@/components/GeneratedAvatar';
import { ChevronDown, CreditCard, CreditCardIcon, LogOut, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const DashboardUserButton = () => {
    const { data, isPending } = authClient.useSession();
    const isMobile = useIsMobile();
    const router = useRouter();

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in');
                }
            }
        });
    }

    if(isPending || !data?.user) return null;

    if(isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className='gap-x-2 rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden'>
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image}/>
                        </Avatar>
                    ) : (
                        <GeneratedAvatar seed={data.user.name} variant='initials' className='size-9 mr-3' />
                    )}
                    <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                        <p className='text-sm truncate w-full'>{data.user.name}</p>
                        <p className='text-xs truncate w-full'>{data.user.email}</p>
                    </div>
                    <ChevronDown className='size-4 shrink-0' />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{data.user.name}</DrawerTitle>
                        <DrawerDescription>{data.user.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button variant={'outline'}>
                            <CreditCardIcon className='size-4 text-black' />
                            <span>Billing</span>
                        </Button>
                        <Button variant={'outline'} onClick={onLogout}>
                            <LogOutIcon className='size-4 text-black' />
                            <span>Logout</span>
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

  return ( 
    <DropdownMenu>
        <DropdownMenuTrigger className='gap-x-2 rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden'>
            {data.user.image ? (
                <Avatar>
                    <AvatarImage src={data.user.image}/>
                </Avatar>
            ) : (
                <GeneratedAvatar seed={data.user.name} variant='initials' className='size-9 mr-3' />
            )}
            <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                <p className='text-sm truncate w-full'>{data.user.name}</p>
                <p className='text-xs truncate w-full'>{data.user.email}</p>
            </div>
            <ChevronDown className='size-4 shrink-0' />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' side='right' className='w-72'>
            <DropdownMenuLabel>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium truncate'>{data.user.name}</p>
                    <p className='text-sm text-muted-foreground truncate font-normal'>{data.user.email}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='cursor-pointer flex items-center justify-between'>
                Billing
                <CreditCard className='size-4 ml-auto' />
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer flex items-center justify-between' onClick={onLogout}>
                Logout
                <LogOut className='size-4 ml-auto' />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DashboardUserButton