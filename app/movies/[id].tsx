import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { addToSavedMovies, checkSavedMovie, removeFromSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface movieInfoProps {
  label: string;
  value?: string | number | null;
}
const MovieInfo = ({ label, value }: movieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);
const Movies = () => {
  const { id } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  useEffect(() => {
    const checkMovie = async () => {
      if (id) {
        let movieIsSaved = await checkSavedMovie(parseInt(id as string));
        setIsSaved(movieIsSaved);
      }
    };
    checkMovie();
  }, [id])

  const toggleSave = async () => {
    const movieData = movie!;
    if(isSaved){
      await removeFromSavedMovies(movieData.id);
      setIsSaved(false);
    } else{
      await addToSavedMovies(
        movieData.id,
        movieData.title,
        movieData.poster_path || ""
      );
      setIsSaved(true);
    }
  }
  
  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[450px]"
            resizeMode="stretch"
          />
          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <View className="w-full flex flex-row items-start justify-between">
              <View>
                <View className="flex-row items-center gap-x-1 mt-2">
                  <Text className="text-light-200 text-sm ">
                    {movie?.release_date?.split("-")[0]}
                  </Text>
                  <Text className="text-light-200 text-sm ">{movie?.runtime}m</Text>
                </View>
                <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                  <Image source={icons.star} className="size-4" />
                  <Text className="text-white text-sm font-bold">
                    {Math.round(movie?.vote_average ?? 0)}/10
                  </Text>
                  <Text className="text-light-200 text-sm">
                    {Math.round(movie?.vote_count ?? 0)} votes
                  </Text>
                </View>
              </View>
              <View className="">
                <TouchableOpacity
                  className="flex flex-col justify-center items-center gap-1"
                  onPress={toggleSave}
                >
                  <Image source={isSaved ? icons.saved : icons.save} className="size-5 text-center" />
                  <Text className="text-white font-semibold">{isSaved ? "Saved" : "Save"}</Text>
                </TouchableOpacity>
              </View>

              
            </View>
            <MovieInfo label="Overview" value={movie?.overview} />
            <MovieInfo
              label="Genres"
              value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
            />
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo
                label="Budget"
                value={`$${(movie?.budget ?? 0) / 1000000}M`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.min(movie?.revenue ?? 0 / 1000000).toFixed(2)}M`}
              />
            </View>
            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies?.map((c) => c.name).join(" - ") ||
                "N/A"
              }
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row  items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor={"#fff"}
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Movies;
