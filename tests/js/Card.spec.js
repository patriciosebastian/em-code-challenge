import { render, screen } from '@testing-library/vue';
import Card from '../../resources/js/components/Card.vue';

test('show new button is rendered in DOM', () => {
    render(Card);

    // screen.getByText('Show New');
    const showNewButton = screen.getByText('Show New');
    expect(showNewButton).not.toBeNull();
});
