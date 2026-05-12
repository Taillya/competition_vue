<template>
    <div class="main">
        <headers></headers>
        <div class="chat-container">

            <!-- 标题测试 -->
            <h1 class="chat-title">AI 赛事助手</h1>
            <p class="chat-subtitle">问我竞赛日程、报名步骤、材料要求等都可以。对话会保存在本浏览器（按登录账号区分），离开页面后仍会保留，除非点「清空」或更换账号。事实类内容已做脱敏展示，回答仅供参考，重要事项请以学校与组委会通知为准。</p>
            <!-- 聊天消息区域 -->
            <div class="messages" ref="messagesContainer">
                <!-- 遍历消息列表，渲染每条消息 -->
                <div
                        v-for="(message, index) in messages"
                        :key="index"
                        :class="['message', message.type]"
                >
                    <div class="message-content">
                        <div v-if="message.type === 'ai'" class="avatar ai-avatar">AI</div>
                        <div v-if="message.type === 'user'" class="avatar">U</div>
                        <div class="bubble">
                            <div class="message-text">
                                <!-- 显示用户消息 -->
                                <div v-if="message.type === 'user'"><div class="text">{{ message.text }}</div></div>
                                <!-- AI：流式拼接后以 Markdown 样式渲染 -->
                                <div
                                        v-if="message.type === 'ai'"
                                        class="ai-rich"
                                        v-html="formatAiHtml(message.display || '')"
                                />
                            </div>
                            <!-- 显示消息的时间戳 -->
                            <div class="timestamp">{{ message.timestamp }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 输入区域 -->
            <div class="input-area">
                <input
                        v-model="inputMessage"
                        type="text"
                        placeholder="例如：某竞赛的报名时间、需要提交哪些材料、赛道有什么区别…"
                        @keyup.enter="sendMessage"
                        class="input-field"
                />
                <button type="button" @click="clearChatHistory" class="clear-button" title="清空本地保存的对话">
                    清空
                </button>
                <button @click="sendMessage" :disabled="!inputMessage" class="send-button">
                    <span>发送</span>
                </button>
            </div>

        </div>
        <bottoms></bottoms>
    </div>

</template>

<script>
    import bottoms from '/src/components/bottom.vue'
    import headers from '/src/components/header.vue'

    export default {
        name: "Chat",
        components: {
            headers,
            bottoms
        },
        methods:{
            // 发送消息的方法
            sendMessage(){
                const text = this.inputMessage.trim();
                if (!text) return;
                this.addUserMessage(text);
                this.inputMessage = '';
                this.AIResponse(text);
            },
            addUserMessage(text){
                this.messages.push({
                    type: 'user',
                    text: text,
                    timestamp: currentTime(),
                })
            },
            AIResponse(userText){
                const aiMessage = {
                    type: 'ai',
                    display: '',
                    timestamp: currentTime(),
                };
                this.messages.push(aiMessage);
                this.scrollToBottom();
                this.createEventSource(aiMessage, userText);
            },
            createEventSource(aiMessage, userText) {
                if (this.eventSource) {
                    this.eventSource.close();
                    this.eventSource = null;
                }
                let url = 'http://localhost:8181/chat?message=' + encodeURIComponent(userText);
                try {
                    const u = JSON.parse(window.localStorage.getItem('user') || '{}');
                    if (u && u.username) {
                        url += '&submitterUserId=' + encodeURIComponent(u.username);
                    }
                    const tok = window.localStorage.getItem('token');
                    if (tok) {
                        url += '&accessToken=' + encodeURIComponent(tok);
                    }
                } catch (e) { /* ignore */ }
                this.eventSource = new EventSource(url);
                let closed = false;
                // 监听消息事件
                this.eventSource.onmessage = (event) => {
                    if(event.data !== '<think>' && event.data !== '</think>'){
                        const next = (aiMessage.display || '') + event.data;
                        this.$set(aiMessage, 'display', next);
                    }
                };
                // 错误处理（流正常结束部分浏览器也会触发 onerror，仅在仍无内容时提示）
                this.eventSource.onerror = () => {
                    if (this.eventSource && !closed) {
                        closed = true;
                        if (!aiMessage.display || aiMessage.display.length === 0) {
                            this.$set(aiMessage, 'display',
                                '未收到回复内容。请确认：1）后端 8181 与 Ollama（默认 11434）已启动；2）模型已下载（与 application.yml 中 spring.ai.ollama.chat.options.model 一致）；3）浏览器控制台是否有跨域或网络错误。');
                        }
                        this.eventSource.close();
                        this.eventSource = null;
                    }
                };
            },
            // 滚动到消息列表底部
            scrollToBottom() {
                this.$nextTick(() => {
                    const container = this.$refs.messagesContainer;
                    container.scrollTop = container.scrollHeight;
                });
            },
            /** 轻量 Markdown：换行、## 标题、**加粗**（内容来自模型，已 HTML 转义） */
            formatAiHtml(raw) {
                if (!raw) {
                    return "";
                }
                let s = String(raw)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
                s = s.replace(/^##\s+(.+)$/gm, "<h3 class=\"ai-md-h3\">$1</h3>");
                s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
                s = s.replace(/\n/g, "<br>");
                return s;
            },
            /** 与 localStorage 中 user 绑定的 key，换账号会换 key，互不影响 */
            chatStorageKey() {
                try {
                    const u = JSON.parse(window.localStorage.getItem('user') || '{}');
                    return 'competition_ai_chat_v1_' + (u && u.username ? u.username : 'guest');
                } catch (e) {
                    return 'competition_ai_chat_v1_guest';
                }
            },
            schedulePersistChat() {
                if (this._persistTimer) {
                    clearTimeout(this._persistTimer);
                }
                this._persistTimer = setTimeout(() => {
                    this._persistTimer = null;
                    this.persistChatHistory();
                }, 400);
            },
            persistChatHistory() {
                try {
                    const u = JSON.parse(window.localStorage.getItem('user') || '{}');
                    const payload = {
                        username: u && u.username ? u.username : null,
                        messages: this.messages
                    };
                    localStorage.setItem(this.chatStorageKey(), JSON.stringify(payload));
                } catch (e) { /* ignore */ }
            },
            restoreChatHistory() {
                try {
                    const raw = localStorage.getItem(this.chatStorageKey());
                    if (!raw) return;
                    const data = JSON.parse(raw);
                    if (!data || !Array.isArray(data.messages) || data.messages.length === 0) return;
                    const u = JSON.parse(window.localStorage.getItem('user') || '{}');
                    const uname = u && u.username ? u.username : null;
                    if (data.username !== uname) return;
                    this.messages = data.messages;
                    this.$nextTick(() => this.scrollToBottom());
                } catch (e) { /* ignore */ }
            },
            clearChatHistory() {
                this.messages = [];
                try {
                    localStorage.removeItem(this.chatStorageKey());
                } catch (e) { /* ignore */ }
            }
        },
        watch: {
            // 监听消息列表的变化，当有新消息时滚动到底部
            messages: {
                handler() {
                    this.scrollToBottom();
                    this.schedulePersistChat();
                },
                deep: true
            }
        },
        computed: {
            // 计算当前时间，格式为 HH:MM

        },
        data(){
            return{
                inputMessage:'',
                messages:[],
                eventSource: null,
                _persistTimer: null
            }
        },
        mounted() {
            this.restoreChatHistory();
        },
        beforeDestroy() {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = null;
            }
            if (this._persistTimer) {
                clearTimeout(this._persistTimer);
            }
            this.persistChatHistory();
        }
    }

    function currentTime() {
        return new Date().toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
</script>

<style scoped>
    .main{
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    /* 标题样式 */
    .chat-title {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color: #007bff;
        padding: 15px 0 8px;
        border-bottom: 1px solid #e0e0e0;
        margin: 0;
        background-color: #f9f9f9;
    }

    .chat-subtitle {
        text-align: center;
        font-size: 13px;
        color: #606266;
        margin: 0;
        padding: 0 16px 12px;
        background-color: #f9f9f9;
        border-bottom: 1px solid #e0e0e0;
        line-height: 1.5;
    }

    /* 聊天容器样式 */
    .chat-container {
        max-width: 800px;
        margin: 20px auto;
        height: 76vh;
        display: flex;
        flex-direction: column;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        /* 添加背景图片，假设图片在项目的 src/assets 目录下，路径为 src/assets/bg.jpg，你需要根据实际情况修改路径 */
        background-image: url('../assets/image/index3.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    /* 消息区域样式 */
    .messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.8); /* 设置半透明背景，使内容更易读 */
        scrollbar-width: thin;
        scrollbar-color: #ccc #f5f5f5;
    }

    /* 消息滚动条样式 */
    .messages::-webkit-scrollbar {
        width: 8px;
    }

    .messages::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 4px;
    }

    .messages::-webkit-scrollbar-track {
        background-color: #f5f5f5;
    }

    /* 单条消息样式 */
    .message {
        margin: 10px 0;
        transition: all 0.3s ease;
    }

    /* 消息内容样式 */
    .message-content {
        display: flex;
        align-items: flex-start;
        max-width: 80%;
    }

    /* 用户消息内容样式 */
    .user .message-content {
        margin-left: auto;
        flex-direction: row-reverse;
    }

    /* 头像样式 */
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
        font-weight: bold;
    }

    /* AI 头像样式 */
    .ai-avatar {
        background: #2563eb;
    }

    /* 消息气泡样式 */
    .bubble {
        max-width: 70%;
        padding: 12px 16px;
        border-radius: 12px;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    /* 用户消息气泡样式 */
    .user .bubble {
        background: #007bff;
        color: white;
        border-radius: 12px 12px 0 12px;
    }

    /* AI 消息气泡样式 */
    .ai .bubble {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 12px 12px 12px 0;
    }

    /* 消息文本样式 */
    .message-text {
        margin-bottom: 8px; /* 给时间戳留出一些空间 */
    }

    /* AI Markdown 渲染（scoped 穿透） */
    .ai-rich >>> .ai-md-h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 10px 0 6px;
        color: #303133;
        line-height: 1.4;
    }

    .ai-rich >>> strong {
        font-weight: 600;
        color: #1a1a1a;
    }

    .ai-rich {
        text-align: left;
        line-height: 1.65;
        word-break: break-word;
        white-space: normal;
    }

    /* 时间戳样式 */
    .timestamp {
        font-size: 0.8em;
        opacity: 0.8;
        text-align: right;
    }

    /* 用户消息时间戳样式 */
    .user .timestamp {
        color: rgba(255, 255, 255, 0.8);
    }

    /* 输入区域样式 */
    .input-area {
        display: flex;
        padding: 20px;
        background: rgba(255, 255, 255, 0.8); /* 设置半透明背景，使内容更易读 */
        border-top: 1px solid #eee;
    }

    /* 输入框样式 */
    .input-field {
        flex: 1;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-right: 10px;
        transition: border-color 0.3s ease;
    }

    .input-field:focus {
        outline: none;
        border-color: #007bff;
    }

    /* 发送按钮样式 */
    .send-button {
        padding: 12px 24px;
        background: #409eff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .send-button:hover {
        background: #0056b3;
    }

    .clear-button {
        padding: 12px 14px;
        margin-right: 8px;
        background: #fff;
        color: #606266;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s;
        white-space: nowrap;
    }

    .clear-button:hover {
        border-color: #409eff;
        color: #409eff;
    }

    .send-button:disabled {
        background: #a0cfff;
        cursor: not-allowed;
    }

    /* 输入指示器动画 */
    @keyframes typing {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    .user-info {
        position: absolute;
        top: 10px;
        right: 60px;
        display: flex;
        align-items: center;
    }
</style>
