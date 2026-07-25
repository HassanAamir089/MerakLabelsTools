export function formatMessage(message) {
    if (!message) return message

    let formatted = message.charAt(0).toUpperCase() + message.slice(1)

    if (!/[.!?]$/.test(formatted)) {
        formatted += '.'
    }

    return formatted
}