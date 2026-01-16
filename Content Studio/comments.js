/**
 * Comment System for Content Studio
 * localStorage-based comment system
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class CommentSystem {
    constructor() {
        this.storageKey = 'a3km_comments_';
        this.userKey = 'a3km_user_info';
    }

    // ==================== USER MANAGEMENT ====================

    getUserInfo() {
        try {
            const user = localStorage.getItem(this.userKey);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error reading user info:', error);
            return null;
        }
    }

    setUserInfo(name, email, avatar = null) {
        const userInfo = {
            name: name,
            email: email,
            avatar: avatar || this.generateAvatar(name),
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem(this.userKey, JSON.stringify(userInfo));
        return userInfo;
    }

    generateAvatar(name) {
        // Generate simple avatar based on initials
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const colors = ['#CC0000', '#FF3333', '#990000', '#FF6666', '#CC0033'];
        const bgColor = colors[name.length % colors.length];
        
        return {
            type: 'initials',
            initials: initials,
            bgColor: bgColor
        };
    }

    // ==================== COMMENT CRUD ====================

    getComments(contentId) {
        try {
            const key = this.storageKey + contentId;
            const comments = localStorage.getItem(key);
            return comments ? JSON.parse(comments) : [];
        } catch (error) {
            console.error('Error reading comments:', error);
            return [];
        }
    }

    addComment(contentId, commentText, parentId = null) {
        const user = this.getUserInfo();
        if (!user) {
            throw new Error('User not logged in');
        }

        const comments = this.getComments(contentId);
        
        const newComment = {
            id: this.generateId(),
            contentId: contentId,
            parentId: parentId,
            text: commentText,
            author: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            replies: [],
            edited: false,
            editedAt: null
        };

        if (parentId) {
            // Add as reply
            const parentComment = this.findCommentById(comments, parentId);
            if (parentComment) {
                parentComment.replies.push(newComment);
            }
        } else {
            // Add as top-level comment
            comments.push(newComment);
        }

        this.saveComments(contentId, comments);
        return newComment;
    }

    editComment(contentId, commentId, newText) {
        const comments = this.getComments(contentId);
        const comment = this.findCommentById(comments, commentId);
        
        if (comment) {
            comment.text = newText;
            comment.edited = true;
            comment.editedAt = new Date().toISOString();
            this.saveComments(contentId, comments);
            return true;
        }
        
        return false;
    }

    deleteComment(contentId, commentId) {
        const comments = this.getComments(contentId);
        const filtered = this.removeCommentById(comments, commentId);
        this.saveComments(contentId, filtered);
        return true;
    }

    toggleLike(contentId, commentId) {
        const user = this.getUserInfo();
        if (!user) return false;

        const comments = this.getComments(contentId);
        const comment = this.findCommentById(comments, commentId);
        
        if (comment) {
            const userEmail = user.email;
            const likedIndex = comment.likedBy.indexOf(userEmail);
            
            if (likedIndex === -1) {
                // Add like
                comment.likes++;
                comment.likedBy.push(userEmail);
            } else {
                // Remove like
                comment.likes = Math.max(0, comment.likes - 1);
                comment.likedBy.splice(likedIndex, 1);
            }
            
            this.saveComments(contentId, comments);
            return true;
        }
        
        return false;
    }

    // ==================== COMMENT STATISTICS ====================

    getCommentCount(contentId, includeReplies = true) {
        const comments = this.getComments(contentId);
        
        if (!includeReplies) {
            return comments.length;
        }
        
        return this.countAllComments(comments);
    }

    countAllComments(comments) {
        let count = comments.length;
        comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                count += this.countAllComments(comment.replies);
            }
        });
        return count;
    }

    getTopCommenters(contentId, limit = 5) {
        const comments = this.getComments(contentId);
        const commenterMap = new Map();
        
        const processComments = (comments) => {
            comments.forEach(comment => {
                const email = comment.author.email;
                const current = commenterMap.get(email) || {
                    name: comment.author.name,
                    avatar: comment.author.avatar,
                    count: 0
                };
                current.count++;
                commenterMap.set(email, current);
                
                if (comment.replies) {
                    processComments(comment.replies);
                }
            });
        };
        
        processComments(comments);
        
        return Array.from(commenterMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    // ==================== HELPER METHODS ====================

    saveComments(contentId, comments) {
        const key = this.storageKey + contentId;
        localStorage.setItem(key, JSON.stringify(comments));
    }

    findCommentById(comments, commentId) {
        for (let comment of comments) {
            if (comment.id === commentId) {
                return comment;
            }
            if (comment.replies && comment.replies.length > 0) {
                const found = this.findCommentById(comment.replies, commentId);
                if (found) return found;
            }
        }
        return null;
    }

    removeCommentById(comments, commentId) {
        return comments.filter(comment => {
            if (comment.id === commentId) {
                return false;
            }
            if (comment.replies && comment.replies.length > 0) {
                comment.replies = this.removeCommentById(comment.replies, commentId);
            }
            return true;
        });
    }

    generateId() {
        return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ==================== HTML GENERATION ====================

    renderCommentSection(containerId, contentId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = this.getUserInfo();
        const comments = this.getComments(contentId);

        let html = `
            <div class="comment-section">
                <h3 class="comment-heading">Comments (${this.getCommentCount(contentId)})</h3>
                
                ${user ? this.renderCommentForm(contentId) : this.renderLoginPrompt()}
                
                <div class="comments-list">
                    ${comments.length === 0 ? '<p class="no-comments">No comments yet. Be the first to comment!</p>' : ''}
                    ${comments.map(comment => this.renderComment(comment, contentId)).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderLoginPrompt() {
        return `
            <div class="login-prompt">
                <p>Please enter your name to comment:</p>
                <input type="text" id="userName" placeholder="Your Name" />
                <input type="email" id="userEmail" placeholder="Your Email" />
                <button onclick="commentSystem.login()">Continue</button>
            </div>
        `;
    }

    renderCommentForm(contentId, parentId = null) {
        const placeholder = parentId ? 'Write a reply...' : 'Write a comment...';
        const formId = parentId ? `reply-form-${parentId}` : 'main-comment-form';
        
        return `
            <div class="comment-form" id="${formId}">
                <textarea id="comment-text-${parentId || 'main'}" placeholder="${placeholder}" rows="3"></textarea>
                <button onclick="commentSystem.submitComment('${contentId}', ${parentId ? `'${parentId}'` : 'null'})">
                    ${parentId ? 'Reply' : 'Comment'}
                </button>
                ${parentId ? `<button onclick="commentSystem.cancelReply('${parentId}')">Cancel</button>` : ''}
            </div>
        `;
    }

    renderComment(comment, contentId, depth = 0) {
        const user = this.getUserInfo();
        const isOwner = user && user.email === comment.author.email;
        const hasLiked = user && comment.likedBy.includes(user.email);
        const indent = depth * 30;

        return `
            <div class="comment" style="margin-left: ${indent}px;" data-id="${comment.id}">
                <div class="comment-avatar">
                    ${this.renderAvatar(comment.author.avatar)}
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <strong>${comment.author.name}</strong>
                        <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                        ${comment.edited ? '<span class="edited-badge">(edited)</span>' : ''}
                    </div>
                    <div class="comment-text">${this.escapeHTML(comment.text)}</div>
                    <div class="comment-actions">
                        <button onclick="commentSystem.toggleLike('${contentId}', '${comment.id}')" class="${hasLiked ? 'liked' : ''}">
                            👍 ${comment.likes}
                        </button>
                        <button onclick="commentSystem.showReplyForm('${contentId}', '${comment.id}')">Reply</button>
                        ${isOwner ? `
                            <button onclick="commentSystem.editCommentUI('${contentId}', '${comment.id}')">Edit</button>
                            <button onclick="commentSystem.deleteComment('${contentId}', '${comment.id}')">Delete</button>
                        ` : ''}
                    </div>
                    <div id="reply-container-${comment.id}"></div>
                    ${comment.replies && comment.replies.length > 0 ? 
                        comment.replies.map(reply => this.renderComment(reply, contentId, depth + 1)).join('') 
                        : ''}
                </div>
            </div>
        `;
    }

    renderAvatar(avatar) {
        if (avatar.type === 'initials') {
            return `<div class="avatar-initials" style="background: ${avatar.bgColor}">${avatar.initials}</div>`;
        }
        return `<img src="${avatar.url}" alt="Avatar" class="avatar-image" />`;
    }

    // ==================== UI INTERACTIONS ====================

    login() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        
        if (!name || !email) {
            alert('Please enter both name and email');
            return;
        }
        
        if (!this.validateEmail(email)) {
            alert('Please enter a valid email');
            return;
        }
        
        this.setUserInfo(name, email);
        location.reload();
    }

    submitComment(contentId, parentId = null) {
        const textareaId = `comment-text-${parentId || 'main'}`;
        const textarea = document.getElementById(textareaId);
        const text = textarea.value.trim();
        
        if (!text) {
            alert('Please write something');
            return;
        }
        
        try {
            this.addComment(contentId, text, parentId);
            this.renderCommentSection('comments-container', contentId);
        } catch (error) {
            alert(error.message);
        }
    }

    showReplyForm(contentId, parentId) {
        const container = document.getElementById(`reply-container-${parentId}`);
        container.innerHTML = this.renderCommentForm(contentId, parentId);
    }

    cancelReply(parentId) {
        const container = document.getElementById(`reply-container-${parentId}`);
        container.innerHTML = '';
    }

    editCommentUI(contentId, commentId) {
        // Implement edit UI
        const comment = this.findCommentById(this.getComments(contentId), commentId);
        if (!comment) return;
        
        const newText = prompt('Edit your comment:', comment.text);
        if (newText && newText.trim()) {
            this.editComment(contentId, commentId, newText.trim());
            this.renderCommentSection('comments-container', contentId);
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// ==================== GLOBAL INSTANCE ====================

window.commentSystem = new CommentSystem();

console.log('💬 Comment System Loaded');
