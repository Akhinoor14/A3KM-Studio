// ==============================================================================
// POST READER - Article/Post Viewer (Mobile)
// ==============================================================================

(function() {
    'use strict';

    const posts = [
        {
            id: 1,
            slug: "arduino-beginners-guide",
            title: "Getting Started with Arduino: A Complete Beginner's Guide",
            readTime: "8 min read",
            language: "english",
            date: "2024-01-20",
            tags: ["Arduino", "Tutorial", "Beginner"],
            content: `<section class="article-header">
                <span class="article-category">Tutorial</span>
                <h1 class="article-title">Getting Started with Arduino: A Complete Beginner's Guide</h1>
                <div class="article-meta">
                    <span><i class="fas fa-clock"></i> 8 min read</span>
                    <span><i class="fas fa-calendar"></i> January 20, 2024</span>
                    <span><i class="fas fa-language"></i> English</span>
                </div>
            </section>
            
            <div class="article-content">
                <p>Arduino is an open-source electronics platform that makes it easy for beginners to create interactive projects. Whether you want to build robots, home automation systems, or IoT devices, Arduino is the perfect starting point.</p>
                
                <h2>What is Arduino?</h2>
                <p>Arduino consists of both hardware and software. The hardware is a programmable circuit board (microcontroller), and the software is an IDE (Integrated Development Environment) that runs on your computer.</p>
                
                <h3>Why Choose Arduino?</h3>
                <ul>
                    <li>Easy to learn programming environment</li>
                    <li>Affordable hardware components</li>
                    <li>Large community and extensive documentation</li>
                    <li>Compatible with most operating systems</li>
                    <li>Open-source and extensible</li>
                </ul>
                
                <h2>Essential Components</h2>
                <p>To get started with Arduino, you'll need:</p>
                <ol>
                    <li><strong>Arduino board</strong> (UNO recommended for beginners)</li>
                    <li><strong>USB cable</strong> for programming and power</li>
                    <li><strong>Breadboard</strong> for prototyping circuits</li>
                    <li><strong>Jumper wires</strong> to connect components</li>
                    <li><strong>LEDs, resistors, sensors</strong> for projects</li>
                </ol>
                
                <h2>Your First Program</h2>
                <p>The traditional first Arduino program is "Blink" - making an LED turn on and off. Here's the code:</p>
                
                <pre><code>void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}</code></pre>
                
                <blockquote>This simple program demonstrates the basic structure of Arduino code: setup() runs once, and loop() runs continuously.</blockquote>
                
                <h2>Next Steps</h2>
                <p>After mastering the basics, explore advanced topics like sensor integration, motor control, and wireless communication. The Arduino ecosystem offers endless possibilities for creative projects.</p>
                
                <p>Happy making!</p>
            </div>
            
            <footer class="article-footer">
                <div class="article-tags">
                    <span class="article-tag">Arduino</span>
                    <span class="article-tag">Tutorial</span>
                    <span class="article-tag">Beginner</span>
                </div>
                <div class="share-section">
                    <span class="share-label">Share this article</span>
                    <div class="share-buttons">
                        <button class="share-btn" data-platform="facebook"><i class="fab fa-facebook-f"></i></button>
                        <button class="share-btn" data-platform="twitter"><i class="fab fa-twitter"></i></button>
                        <button class="share-btn" data-platform="whatsapp"><i class="fab fa-whatsapp"></i></button>
                        <button class="share-btn" data-platform="copy"><i class="fas fa-link"></i></button>
                    </div>
                </div>
            </footer>`
        },
        {
            id: 2,
            slug: "arduino-bangla-guide",
            title: "আরডুইনো দিয়ে শুরু করুন: সম্পূর্ণ বাংলা গাইড",
            readTime: "১০ মিনিট",
            language: "bangla",
            date: "2024-01-18",
            tags: ["আরডুইনো", "টিউটোরিয়াল", "শিক্ষানবিস"],
            content: `<section class="article-header">
                <span class="article-category">টিউটোরিয়াল</span>
                <h1 class="article-title">আরডুইনো দিয়ে শুরু করুন: সম্পূর্ণ বাংলা গাইড</h1>
                <div class="article-meta">
                    <span><i class="fas fa-clock"></i> ১০ মিনিট পড়ার সময়</span>
                    <span><i class="fas fa-calendar"></i> জানুয়ারি ১৮, ২০২৪</span>
                    <span><i class="fas fa-language"></i> বাংলা</span>
                </div>
            </section>
            
            <div class="article-content">
                <p>আরডুইনো হল একটি ওপেন-সোর্স ইলেকট্রনিক্স প্ল্যাটফর্ম যা নতুনদের জন্য ইন্টারঅ্যাক্টিভ প্রজেক্ট করা সহজ করে তোলে। রোবট, হোম অটোমেশন সিস্টেম বা IoT ডিভাইস তৈরি করতে চাইলে আরডুইনো শুরু করার জন্য পারফেক্ট।</p>
                
                <h2>আরডুইনো কী?</h2>
                <p>আরডুইনোতে হার্ডওয়্যার এবং সফটওয়্যার উভয়ই রয়েছে। হার্ডওয়্যার হল একটি প্রোগ্র্যামেবল সার্কিট বোর্ড (মাইক্রোকন্ট্রোলার), এবং সফটওয়্যার হল একটি IDE যা আপনার কম্পিউটারে চলে।</p>
                
                <h3>আরডুইনো কেন বেছে নেবেন?</h3>
                <ul>
                    <li>শেখার জন্য সহজ প্রোগ্রামিং এনভায়রনমেন্ট</li>
                    <li>সাশ্রয়ী মূল্যের হার্ডওয়্যার কম্পোনেন্ট</li>
                    <li>বড় কমিউনিটি এবং ব্যাপক ডকুমেন্টেশন</li>
                    <li>বেশিরভাগ অপারেটিং সিস্টেমের সাথে সামঞ্জস্যপূর্ণ</li>
                    <li>ওপেন-সোর্স এবং এক্সটেনসিবল</li>
                </ul>
                
                <h2>প্রয়োজনীয় যন্ত্রপাতি</h2>
                <p>আরডুইনো দিয়ে শুরু করতে আপনার লাগবে:</p>
                <ol>
                    <li><strong>আরডুইনো বোর্ড</strong> (শুরুর জন্য UNO সুপারিশ করা হয়)</li>
                    <li><strong>USB ক্যাবল</strong> প্রোগ্রামিং এবং পাওয়ারের জন্য</li>
                    <li><strong>ব্রেডবোর্ড</strong> সার্কিট প্রোটোটাইপিংয়ের জন্য</li>
                    <li><strong>জাম্পার তার</strong> কম্পোনেন্ট সংযোগের জন্য</li>
                    <li><strong>LED, রেজিস্টর, সেন্সর</strong> প্রজেক্টের জন্য</li>
                </ol>
                
                <h2>প্রথম প্রোগ্রাম</h2>
                <p>আরডুইনোর ট্র্যাডিশনাল প্রথম প্রোগ্রাম হল "Blink" - একটি LED চালু এবং বন্ধ করা।</p>
                
                <p>আশা করি এই গাইড আপনার আরডুইনো যাত্রা শুরু করতে সাহায্য করবে!</p>
            </div>
            
            <footer class="article-footer">
                <div class="article-tags">
                    <span class="article-tag">আরডুইনো</span>
                    <span class="article-tag">টিউটোরিয়াল</span>
                    <span class="article-tag">শিক্ষানবিস</span>
                </div>
                <div class="share-section">
                    <span class="share-label">এই আর্টিকেলটি শেয়ার করুন</span>
                    <div class="share-buttons">
                        <button class="share-btn" data-platform="facebook"><i class="fab fa-facebook-f"></i></button>
                        <button class="share-btn" data-platform="twitter"><i class="fab fa-twitter"></i></button>
                        <button class="share-btn" data-platform="whatsapp"><i class="fab fa-whatsapp"></i></button>
                        <button class="share-btn" data-platform="copy"><i class="fas fa-link"></i></button>
                    </div>
                </div>
            </footer>`
        }
    ];

    let currentPost = null;
    let isBookmarked = false;
    const articleContainer = document.getElementById('articleContainer');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const shareBtn = document.getElementById('shareBtn');

    function getPostSlugFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('slug') || 'arduino-beginners-guide';
    }

    function loadPost() {
        const slug = getPostSlugFromUrl();
        currentPost = posts.find(p => p.slug === slug);

        if (!currentPost) {
            articleContainer.innerHTML = `<div style="padding: 60px 20px; text-align: center;">
                <i class="fas fa-exclamation-circle" style="font-size: 56px; color: var(--primary-red); margin-bottom: 20px;"></i>
                <h3>Post Not Found</h3>
                <a href="post-listing.html" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: var(--primary-red); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Back to Posts</a>
            </div>`;
            return;
        }

        articleContainer.innerHTML = currentPost.content;
        checkBookmarkState();
        addShareListeners();
    }

    function toggleBookmark() {
        isBookmarked = !isBookmarked;
        bookmarkBtn.style.color = isBookmarked ? '#ffc107' : 'var(--primary-red)';
        if (navigator.vibrate) navigator.vibrate(isBookmarked ? 30 : 10);
        localStorage.setItem(`post_${currentPost.id}_bookmarked`, isBookmarked);
    }

    function handleShare() {
        if (navigator.vibrate) navigator.vibrate(10);
        if (navigator.share) {
            navigator.share({
                title: currentPost.title,
                text: `Read: ${currentPost.title}`,
                url: window.location.href
            }).catch(() => copyToClipboard(window.location.href));
        } else {
            copyToClipboard(window.location.href);
        }
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Link copied!');
        } catch (err) {}
        document.body.removeChild(textarea);
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(139,0,0,0.95);color:#fff;border-radius:8px;font-size:13px;font-weight:600;z-index:10000;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function checkBookmarkState() {
        isBookmarked = localStorage.getItem(`post_${currentPost.id}_bookmarked`) === 'true';
        if (isBookmarked) bookmarkBtn.style.color = '#ffc107';
    }

    function addShareListeners() {
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (navigator.vibrate) navigator.vibrate(10);
                const platform = btn.getAttribute('data-platform');
                if (platform === 'copy') {
                    copyToClipboard(window.location.href);
                } else {
                    showToast(`Share on ${platform}`);
                }
            });
        });
    }

    function init() {
        loadPost();
        bookmarkBtn.addEventListener('click', toggleBookmark);
        shareBtn.addEventListener('click', handleShare);

        [bookmarkBtn, shareBtn, document.querySelector('.back-btn')].forEach(btn => {
            if (btn) btn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
