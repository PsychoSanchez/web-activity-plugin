import fallback from '../../../static/_locales/en/messages.json';

type I18n = typeof fallback;
type I18NPlaceholder<T extends keyof I18n> = I18n[T] extends {
  placeholders: infer P;
}
  ? [{ [K in keyof P]: string }]
  : [];

export const i18n = <T extends keyof I18n>(
  message: T,
  ...placeholders: I18NPlaceholder<T>
) => {
  const values = placeholders[0];
  if (chrome?.i18n?.getMessage) {
    return (
      chrome.i18n.getMessage(
        message,
        values ? Object.values(values) : undefined,
      ) ?? getMessageFromFallback(message, values)
    );
  }

  return getMessageFromFallback(message, values);
};

function getMessageFromFallback<T extends keyof I18n>(
  message: T,
  values?: Record<string, string>,
) {
  const messageTemplate = fallback[message].message;
  if (!values) {
    return messageTemplate;
  }

  return formatI18NMessage(messageTemplate, values);
}

export function formatI18NMessage(
  message: string,
  values: Record<string, string>,
) {
  let formattedString = '';
  let lastIndex = 0;
  while (true) {
    const openIndex = message.indexOf('$', lastIndex);
    if (openIndex === -1) {
      formattedString += message.slice(lastIndex);
      break;
    }

    const closeIndex = message.indexOf('$', openIndex + 1);
    if (closeIndex === -1) {
      formattedString += message.slice(lastIndex);
      break;
    }

    const placeholderName = message.slice(openIndex + 1, closeIndex);
    formattedString += message.slice(lastIndex, openIndex);
    formattedString += values[placeholderName as keyof typeof values];
    lastIndex = closeIndex + 1;
  }

  return formattedString;
}

// export const i18n = new Proxy(
//   {},
//   {
//     get: (_target, prop) => {
//       return (values) => getI18nMessage(prop as string, values);
//     },
//   },
// ) as { [K in keyof I18n]: (...args: I18NPlaceholder<K>) => string };
