/**
 * YouTube Duration Fetcher
 * Automatically fetches correct durations for all videos in videos.json
 * 
 * Usage:
 * 1. Set your YouTube API key in youtube-api-config.js
 * 2. Run: node fetch-youtube-durations.js
 * 3. Updated videos.json will be created
 */

const fs = require('fs');
const path = require('path');

// YouTube API Configuration
const API_KEY = 'AIzaSyCBMJNDxIvJ5YfYMNupIL8t2l0JC315c2A';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

// Parse YouTube duration format (PT1H2M10S -> 1:02:10)
function parseYouTubeDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
}

// Fetch video durations from YouTube API
async function fetchDurations(videoIds) {
    const results = {};
    
    // YouTube API allows max 50 IDs per request
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < videoIds.length; i += batchSize) {
        batches.push(videoIds.slice(i, i + batchSize));
    }
    
    console.log(`📡 Fetching durations for ${videoIds.length} videos in ${batches.length} batch(es)...`);
    
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const ids = batch.join(',');
        const url = `${YOUTUBE_API_URL}?part=contentDetails&id=${ids}&key=${API_KEY}`;
        
        try {
            console.log(`   Batch ${i + 1}/${batches.length}: Fetching ${batch.length} videos...`);
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error(`❌ API Error: ${data.error.message}`);
                if (data.error.code === 403) {
                    console.error('   Check your API key and quota at: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas');
                }
                continue;
            }
            
            if (data.items) {
                data.items.forEach(item => {
                    const duration = parseYouTubeDuration(item.contentDetails.duration);
                    results[item.id] = duration;
                    console.log(`   ✅ ${item.id}: ${duration}`);
                });
            }
            
            // Wait a bit between batches to avoid rate limiting
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`❌ Batch ${i + 1} failed:`, error.message);
        }
    }
    
    return results;
}

// Update videos.json with correct durations
async function updateVideosJson() {
    console.log('📂 Reading videos.json...');
    
    const jsonPath = path.join(__dirname, 'videos.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    // Collect all video IDs
    const videoIds = [];
    const videoMap = new Map(); // Map videoId to video object reference
    
    if (jsonData.categories) {
        // Process video-blog categories
        if (jsonData.categories['video-blog']) {
            Object.values(jsonData.categories['video-blog']).forEach(category => {
                if (category.videos && Array.isArray(category.videos)) {
                    category.videos.forEach(video => {
                        if (video.videoId) {
                            videoIds.push(video.videoId);
                            videoMap.set(video.videoId, video);
                        }
                    });
                }
            });
        }
        
        // Process educational categories
        if (jsonData.categories['educational']) {
            Object.values(jsonData.categories['educational']).forEach(category => {
                if (category.videos && Array.isArray(category.videos)) {
                    category.videos.forEach(video => {
                        if (video.videoId) {
                            videoIds.push(video.videoId);
                            videoMap.set(video.videoId, video);
                        }
                    });
                }
            });
        }
    }
    
    console.log(`📊 Found ${videoIds.length} videos in JSON`);
    
    if (videoIds.length === 0) {
        console.log('⚠️  No videos found in videos.json');
        return;
    }
    
    // Fetch durations from YouTube
    const durations = await fetchDurations(videoIds);
    
    // Update video objects
    let updateCount = 0;
    durations.forEach((duration, videoId) => {
        const video = videoMap.get(videoId);
        if (video) {
            const oldDuration = video.duration;
            video.duration = duration;
            if (oldDuration !== duration) {
                console.log(`🔄 Updated ${videoId}: ${oldDuration} → ${duration}`);
                updateCount++;
            }
        }
    });
    
    // Save updated JSON
    if (updateCount > 0) {
        console.log(`\n💾 Saving updated videos.json (${updateCount} changes)...`);
        fs.writeFileSync(
            jsonPath,
            JSON.stringify(jsonData, null, 2),
            'utf-8'
        );
        console.log('✅ videos.json updated successfully!');
    } else {
        console.log('\n✅ All durations are already correct!');
    }
    
    console.log(`\n📈 Summary:`);
    console.log(`   Total videos: ${videoIds.length}`);
    console.log(`   Fetched: ${Object.keys(durations).length}`);
    console.log(`   Updated: ${updateCount}`);
}

// Run the script
console.log('🎬 YouTube Duration Fetcher\n');

// Check API key
if (!API_KEY || API_KEY.includes('XXXXXXX')) {
    console.error('❌ API key not configured!');
    console.error('   Edit this file and replace API_KEY with your YouTube Data API v3 key');
    console.error('   Get key from: https://console.cloud.google.com/');
    process.exit(1);
}

updateVideosJson()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
