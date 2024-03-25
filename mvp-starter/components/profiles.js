export default function Profiles() {
    const data = [4, 3, 2,1]
    return (
        <table class="styled-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item}</td>
                                <td>{item}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}
