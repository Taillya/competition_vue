<template>
    <div class="main">
        <headers></headers>
        <div class="chat-container">

            <!-- 标题测试 -->
            <h1 class="chat-title">Spring AI+DeepSeek 智能助手</h1>
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
                                <!-- 显示AI消息 -->
                                <span style="float: left" v-for="(value, valueIndex) in message.value" :key="valueIndex">
                                    {{ value }}
                                </span>
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
                        placeholder="输入你的问题..."
                        @keyup.enter="sendMessage"
                        class="input-field"
                />
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
                if (!this.inputMessage.trim()) return;
                // 添加用户消息到消息列表
                this.addUserMessage();
                // 触发 AI 回复
                this.AIResponse();
                // 清空输入框
                this.inputMessage = '';
            },
            addUserMessage(){
                this.messages.push({
                    type: 'user',
                    text: this.inputMessage,
                    timestamp: currentTime(),
                    value: []
                })
            },
            AIResponse(){
                const aiMessage = {
                    type: 'ai',
                    text: '',
                    timestamp: currentTime(),
                    value: []
                };
                // 添加 AI 消息到消息列表
                this.messages.push(aiMessage);
                // 滚动到消息列表底部
                this.scrollToBottom();
                // 创建 SSE 连接
                this.createEventSource(aiMessage);
            },
            // 创建 SSE 连接
            createEventSource(aiMessage) {
                this.eventSource = new EventSource(`http://localhost:8181/chat?message=${this.inputMessage}`);
                // 监听消息事件
                this.eventSource.onmessage = (event) => {
                    if(event.data !== '<think>' && event.data !== '</think>'){
                        aiMessage.value.push(event.data)
                    }
                };
                // 错误处理
                this.eventSource.onerror = (error) => {
                    this.eventSource.close();
                };
            },
            // 滚动到消息列表底部
            scrollToBottom() {
                this.$nextTick(() => {
                    const container = this.$refs.messagesContainer;
                    container.scrollTop = container.scrollHeight;
                });
            }
        },
        watch: {
            // 监听消息列表的变化，当有新消息时滚动到底部
            messages: {
                handler() {
                    this.scrollToBottom();
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
                messages:[]
            }
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
        padding: 15px 0;
        border-bottom: 1px solid #e0e0e0;
        margin: 0;
        background-color: #f9f9f9;
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
        background: #9ACD32; /* 将 AI 头像颜色设置为绿色 */
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
