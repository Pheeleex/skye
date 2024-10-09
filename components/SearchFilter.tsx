'use client'
import React from 'react'
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger } from './ui/dropdown-menu'
import { ProductType, SkinConcern, SkinType } from '@/constants'
import { Products, StoreProps } from '@/types/firebasetypes'
import { useRouter } from 'next/navigation'

const SearchFilter = ({searchParams}: StoreProps) => {
  const router = useRouter()
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as any)
    if(value){
      params.set(key, value)
      console.log(key, value)
    }
    else{
      params.delete(key)
    }
    router.push(`?${params.toString()}`);
  }
  return (
    <div className='flex justify-center items-center gap-40 m-20'>
        <DropdownMenu>
            <DropdownMenuTrigger>Skin Type</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Skin Type</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {
        SkinType.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => updateSearchParams('skinType', type)}
            >
              {type}
            </DropdownMenuItem>
        ))
    }
    
  </DropdownMenuContent>
</DropdownMenu>

<DropdownMenu>
            <DropdownMenuTrigger>Product Type</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Product Type</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {
        ProductType.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => updateSearchParams('category', type)}
            >
              {type}
            </DropdownMenuItem>
        ))
    }
    
  </DropdownMenuContent>
</DropdownMenu>

<DropdownMenu>
            <DropdownMenuTrigger>Skin Concern</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Skin Concern</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {
        SkinConcern.map((concern) => (
            <DropdownMenuItem
              key={concern}
              onClick={()=>updateSearchParams('skinConcern', concern)}
            >{concern}</DropdownMenuItem>
        ))
    }
    
  </DropdownMenuContent>
</DropdownMenu>

    </div>
  )
}

export default SearchFilter
