import { render, fireEvent } from '@testing-library/react';
import { PromptInput } from './prompt-input';

describe('PromptInput', () => {
  it('calls onSendAction when Enter is pressed', () => {
    const onSend = vi.fn();
    const { getByPlaceholderText } = render(<PromptInput onSendAction={onSend} />);
    const textarea = getByPlaceholderText('Type your message here...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onSend).toHaveBeenCalledWith('Hello');
  });
});
