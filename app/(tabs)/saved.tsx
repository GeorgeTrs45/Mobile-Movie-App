import TrendingCard from '@/components/TrendingCard'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { getSavedMovies } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Saved = () => {
  const { data: savedMovies, error, loading } = useFetch(() => getSavedMovies());

  return (
    <View className='bg-primary flex-1'>
      <Image source={images.bg} className='absolute w-full z-0' />
      <SafeAreaView className='flex-1 px-5'>
        <Image source={icons.logo} className='w-12 h-10 mt-10 mb-5 mx-auto' />
        <View className='mt-10'>
          <Text className="text-lg text-white font-bold mb-3">Saved Movies</Text>
          {loading && (
            <ActivityIndicator
              size={'large'}
              color={'#fff'}
              className='mt-10 self-center' />
          )}
          {error && (
            <Text className='text-white text-lg text-center mt-10'>
              Error: {error.message}
            </Text>
          )}
          {savedMovies && savedMovies.length == 0 && (
            <Text className='text-white text-lg text-center mt-10'>
              No saved movies found
            </Text>
          )}
          {savedMovies && savedMovies.length > 0 && (
            <View className=''>
              <FlatList data={savedMovies}
                keyExtractor={(item) => item.movie_id.toString()}
                className='mt-5'
                renderItem={({ item, index }) => {
                  return (
                    <TrendingCard
                      movie={{
                        movie_id: item.movie_id,
                        title: item.title,
                        poster_url: item.poster_url,
                        count: 0,
                        searchTerm: "",
                      }}
                      index={index}
                    />
                  )
                }}
                contentContainerStyle={{ gap: 20 }}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-around' }}

              />
            </View>
          )}
        </View> 

      </SafeAreaView>

    </View>
  )
}

export default Saved