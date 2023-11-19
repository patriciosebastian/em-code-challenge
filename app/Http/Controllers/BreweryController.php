<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BreweryController extends Controller
{
    /**
     * Get random brewery
     */
    public function getRandomBrewery()
    {
        $response = Http::get('https://api.openbrewerydb.org/v1/breweries/random');

        if ($response->successful()) {
            $breweries = $response->json();

            // first brewery in the array
            $breweryData = $breweries[0];

            // check if brewery already exists in table
            $localBrewery = DB::table('breweries')->where('brewery_id', $breweryData['id'])->first();

            if ($localBrewery) {
                // add likes and dislikes from local db to brewery data
                $breweryData['likes'] = $localBrewery->likes;
                $breweryData['dislikes'] = $localBrewery->dislikes;
            } else {
                // if not in local db, set likes and dislikes to 0
                $breweryData['likes'] = 0;
                $breweryData['dislikes'] = 0;
            }

            return response()->json($breweryData);
        } else {
            return resonse()->json(['error' => 'Failed to fetch data'], 500);
        }
    }
    
    /**
     * Store brewery in DB and increment Likes
     */
    public function like(Request $request)
    {
        $breweryId = $request->input('brewery_id');

        DB::transaction(function () use ($request, $breweryId) {
    
            // check if brewery already exists in table
            $brewery = DB::table('breweries')->where('brewery_id', $breweryId)->first();
    
            // if not, insert it
            if (!$brewery) {
                DB::table('breweries')->insert([
                    'brewery_id' => $breweryId,
                    'name' => $request->input('name'),
                    'website_url' => $request->input('website_url'),
                    'city' => $request->input('city'),
                    'state' => $request->input('state'),
                    'brewery_type' => $request->input('breweryType'),
                    'address_1' => '',
                    'postal_code' => '',
                ]);
            }
    
            // increment likes
            DB::table('breweries')->where('brewery_id', $breweryId)->increment('likes');
        });
    
        // get updated data
        $updatedBrewery = DB::table('breweries')->where('brewery_id', $breweryId)->first();

        // return updated likes and dislikes
        return response()->json([
            'likes' => $updatedBrewery->likes,
            'dislikes' => $updatedBrewery->dislikes
        ]);
    }

    /**
     * Store brewery in DB and increment Dislikes
     */
    public function dislike(Request $request)
    {
        $breweryId = $request->input('brewery_id');

        DB::transaction(function () use ($request, $breweryId) {

            // check if brewery already exists in table
            $brewery = DB::table('breweries')->where('brewery_id', $breweryId)->first();

            // if not, insert it
            if (!$brewery) {
                DB::table('breweries')->insert([
                    'brewery_id' => $breweryId,
                    'name' => $request->input('name'),
                    'website_url' => $request->input('website_url'),
                    'city' => $request->input('city'),
                    'state' => $request->input('state'),
                    'brewery_type' => $request->input('breweryType'),
                    'address_1' => '',
                    'postal_code' => '',
                ]);
            }

            // decrement likes
            DB::table('breweries')->where('brewery_id', $breweryId)->increment('dislikes');
        });

        // get updated data
        $updatedBrewery = DB::table('breweries')->where('brewery_id', $breweryId)->first();

        // return updated likes and dislikes
        return response()->json([
            'likes' => $updatedBrewery->likes,
            'dislikes' => $updatedBrewery->dislikes
        ]);
    }

    /**
     * Top Ten Breweries
     */
    public function topTen()
    {
        $topTenBreweries = DB::table('breweries')
                            ->select('name', 'website_url', 'city', 'state', 'brewery_type', DB::raw('(likes - dislikes) as score'))
                            ->orderbyDesc('score')
                            ->limit(10)
                            ->get();

        return response()->json($topTenBreweries);
    }
}
