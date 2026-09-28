import { useEffect } from 'react'
import { Hero } from '@/components/sections/Hero'
import { FeaturedProduct } from '@/components/sections/FeaturedProduct'
import { Collection } from '@/components/sections/Collection'
import { ProductStory } from '@/components/sections/ProductStory'
import { Technology } from '@/components/sections/Technology'
import { BrandStory } from '@/components/sections/BrandStory'
import { SocialProof } from '@/components/sections/SocialProof'
import { FinalCTA } from '@/components/sections/FinalCTA'

export function Home() {
  useEffect(() => {
    document.title = 'AURA — Move differently.'
  }, [])

  return (
    <>
      <Hero />
      <FeaturedProduct />
      <Collection />
      <ProductStory />
      <Technology />
      <BrandStory />
      <SocialProof />
      <FinalCTA />
    </>
  )
}
