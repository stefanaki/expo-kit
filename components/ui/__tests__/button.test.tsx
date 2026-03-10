/**
 * Colocated unit test for Button component.
 *
 * Pattern: render the component in isolation; assert on visible behavior.
 * No snapshots — Uniwind-styled components change frequently.
 */
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithProviders } from '@tests/setup';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

describe('<Button />', () => {
  it('renders its label text', () => {
    renderWithProviders(
      <Button>
        <Text>Save</Text>
      </Button>
    );
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithProviders(
      <Button onPress={onPress}>
        <Text>Submit</Text>
      </Button>
    );
    fireEvent.press(screen.getByText('Submit'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithProviders(
      <Button disabled onPress={onPress}>
        <Text>Submit</Text>
      </Button>
    );
    fireEvent.press(screen.getByText('Submit'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
