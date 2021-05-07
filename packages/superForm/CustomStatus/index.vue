<script>
    // import { byKeyGetItem } from '@/utils';
    import './index.scss';

    export default {
        name: 'CustomStatus',
        props: {
            list: {
                type: Array,
                default: () => [],
            },
            value: {
                type: [Number, String, Boolean],
                default: 0,
            },
            subKey: {
                type: String,
                default: 'key',
            },
        },
        data() {
            return {};
        },
        computed: {
            status() {
                // const { list, value, subKey } = this;
                // return byKeyGetItem(list, value, subKey);
                return '';
            },
        },
        render() {
            const { status } = this;

            return (
                <div class='custom-status'>
                    {status.color ? <span class='ball' style={{ background: status.color }}></span> : null}
                    <span>{status.value}</span>
                </div>
            );
        },
    };
</script>
